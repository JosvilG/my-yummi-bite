import Constants from 'expo-constants';
import { getMockRecipes, getMockRecipeById } from './mockRecipes';
import FeatureFlags from '@/config/featureFlags';
import { log } from '@/lib/logger';
import { captureException } from '@/lib/sentry';

const FUNCTIONS_BASE_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_FUNCTIONS_BASE_URL ||
  process.env.EXPO_PUBLIC_FUNCTIONS_BASE_URL;

const stripTrailingSlashes = (value: string): string => value.replace(/\/+$/, '');
const ensureFunctionsBaseUrl = (): string => {
  const url = FUNCTIONS_BASE_URL?.trim();
  if (!url) {
    throw new Error('Spoonacular proxy URL is not configured');
  }
  return stripTrailingSlashes(url);
};

type QueryParams = Record<string, string | number | undefined>;
type ProxyResponse<T> = T & { success?: boolean; error?: string };

const buildFunctionsUrl = (baseUrl: string, path: string, params: QueryParams): string => {
  const url = new URL(`${baseUrl}/${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    url.searchParams.set(key, String(value));
  });
  return url.toString();
};

const fetchFromFunctions = async <T extends object>(
  path: string,
  params: QueryParams
): Promise<T> => {
  const baseUrl = ensureFunctionsBaseUrl();
  const url = buildFunctionsUrl(baseUrl, path, params);
  log.info('Calling functions proxy', { path, url });
  const response = await fetch(url);
  const payload = (await response.json()) as ProxyResponse<T>;

  if (!response.ok) {
    throw new Error(payload.error ?? `Proxy request failed with status ${response.status}`);
  }

  if (payload.success === false) {
    throw new Error(payload.error ?? 'Proxy returned an error');
  }

  return payload;
};

const formatCuisineFilters = (filters: string[]): string | undefined => {
  const normalized = filters
    .map((item) => String(item ?? '').trim())
    .filter(Boolean)
    .slice(0, 5);
  return normalized.length ? normalized.join(',') : undefined;
};

const handleProxyError = (
  operation: string,
  error: unknown,
  metadata?: Record<string, unknown>
): string => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  log.error(`Spoonacular proxy failed: ${operation}`, message, metadata);
  captureException(error as Error, { operation, ...metadata });
  return message;
};

export interface RecipeNutrition {
  nutrients?: { name: string; amount: number; unit: string }[];
}

export interface RecipeSummary {
  id: number;
  title?: string;
  image?: string;
  readyInMinutes?: number;
  servings?: number;
  summary?: string;
  nutrition?: RecipeNutrition;
  analyzedInstructions?: { steps: { number: number; step: string }[] }[];
  extendedIngredients?: Array<{
    id: number;
    name: string;
    amount?: number;
    unit?: string;
    image?: string;
    measures?: { metric?: { amount?: number; unitShort?: string } };
  }>;
  cuisines?: string[];
  dishTypes?: string[];
  [key: string]: unknown;
}

const buildCuisineParam = (filters: string[]): string | undefined =>
  filters.length ? formatCuisineFilters(filters) : undefined;

export const fetchRandomRecipes = async (
  cuisineFilters: string[] = [],
  numberOfRecipes = 1,
  mealType?: string | null
): Promise<{ success: boolean; recipes?: RecipeSummary[]; error?: string }> => {
  if (FeatureFlags.USE_MOCK_RECIPES) {
    log.debug('Using mock recipes', { count: numberOfRecipes, cuisineFilters, mealType });
    const mockRecipes = getMockRecipes(numberOfRecipes, cuisineFilters, mealType);
    return { success: true, recipes: mockRecipes };
  }

  try {
    const cuisineParam = buildCuisineParam(cuisineFilters);
    const sanitizedMealType = mealType?.trim() || undefined;
    const params: QueryParams = {
      number: numberOfRecipes,
      ...(cuisineParam ? { cuisine: cuisineParam } : {}),
      ...(sanitizedMealType ? { mealType: sanitizedMealType } : {}),
    };

    log.info('Fetching random recipes through proxy', { numberOfRecipes, cuisineFilters, mealType });
    const data = await fetchFromFunctions<{ recipes?: RecipeSummary[] }>('recipesRandom', params);
    return { success: true, recipes: data.recipes ?? [] };
  } catch (error) {
    const message = handleProxyError('fetchRandomRecipes', error, {
      numberOfRecipes,
      cuisineFilters,
      mealType,
    });
    return { success: false, error: message };
  }
};

export const fetchRecipeInfo = async (
  recipeId: number
): Promise<{ success: boolean; recipe?: RecipeSummary; error?: string }> => {
  if (FeatureFlags.USE_MOCK_RECIPES) {
    log.debug('Using mock recipe info', { recipeId });
    const mockRecipe = getMockRecipeById(recipeId);
    if (mockRecipe) {
      return { success: true, recipe: mockRecipe };
    }
    return { success: false, error: 'Recipe not found in mock data' };
  }

  if (recipeId <= 0 || !Number.isFinite(recipeId)) {
    return { success: false, error: 'recipeId must be a positive number' };
  }

  try {
    log.info('Fetching recipe info through proxy', { recipeId });
    const data = await fetchFromFunctions<{ recipe?: RecipeSummary }>('recipesInfo', { recipeId });
    return { success: true, recipe: data.recipe };
  } catch (error) {
    const message = handleProxyError('fetchRecipeInfo', error, { recipeId });
    return { success: false, error: message };
  }
};

export const searchRecipes = async (
  searchQuery: string,
  cuisineFilters: string[] = [],
  numberOfRecipes = 10
): Promise<{ success: boolean; recipes?: RecipeSummary[]; error?: string }> => {
  if (FeatureFlags.USE_MOCK_RECIPES) {
    log.debug('Searching mock recipes', { searchQuery, cuisineFilters });
    let recipes = getMockRecipes(numberOfRecipes, cuisineFilters);
    if (searchQuery) {
      recipes = recipes.filter((r) => r.title?.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return { success: true, recipes };
  }

  const trimmedQuery = searchQuery?.trim();
  if (!trimmedQuery) {
    return { success: false, error: 'search query is required' };
  }

  try {
    const cuisineParam = buildCuisineParam(cuisineFilters);
    const params: QueryParams = {
      query: trimmedQuery,
      number: numberOfRecipes,
      ...(cuisineParam ? { cuisine: cuisineParam } : {}),
    };

    log.info('Searching recipes through proxy', { searchQuery, cuisineFilters });
    const data = await fetchFromFunctions<{ recipes?: RecipeSummary[] }>('recipesSearch', params);
    return { success: true, recipes: data.recipes ?? [] };
  } catch (error) {
    const message = handleProxyError('searchRecipes', error, { searchQuery, cuisineFilters });
    return { success: false, error: message };
  }
};
