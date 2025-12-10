import Constants from 'expo-constants';
import { getMockRecipes, getMockRecipeById } from './mockRecipes';
import FeatureFlags from '@/config/featureFlags';
import { log } from '@/lib/logger';
import { captureException } from '@/lib/sentry';

const API_BASE_URL = 'https://api.spoonacular.com/recipes';
const API_KEY =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_SPOONACULAR_API_KEY ||
  process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY;

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

export const fetchRandomRecipes = async (
  cuisineFilters: string[] = [],
  numberOfRecipes = 1,
  mealType?: string | null
): Promise<{ success: boolean; recipes?: RecipeSummary[]; error?: string }> => {
  if (FeatureFlags.USE_MOCK_RECIPES) {
    log.debug('Using mock recipes', { count: numberOfRecipes, cuisineFilters });
    const mockRecipes = getMockRecipes(numberOfRecipes, cuisineFilters);
    return { success: true, recipes: mockRecipes };
  }

  try {
    log.info('Fetching random recipes from API', { numberOfRecipes, cuisineFilters, mealType });
    let url = `${API_BASE_URL}/complexSearch?apiKey=${API_KEY}&number=${numberOfRecipes}&sort=random&addRecipeNutrition=true`;

    if (cuisineFilters.length > 0) {
      url += `&cuisine=${cuisineFilters.join(',')}`;
    }

    if (mealType) {
      url += `&type=${mealType.toLowerCase()}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    log.info('Random recipes fetched successfully', { count: data.results?.length });
    return { success: true, recipes: data.results as RecipeSummary[] };
  } catch (error: unknown) {
    log.error('Error fetching random recipes', error, { numberOfRecipes, cuisineFilters, mealType });
    captureException(error as Error, { operation: 'fetchRandomRecipes' });
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
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

  try {
    log.info('Fetching recipe info from API', { recipeId });
    const url = `${API_BASE_URL}/${recipeId}/information?apiKey=${API_KEY}&includeNutrition=true`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as RecipeSummary;
    log.info('Recipe info fetched successfully', { recipeId, title: data.title });
    return { success: true, recipe: data };
  } catch (error: unknown) {
    log.error('Error fetching recipe info', error, { recipeId });
    captureException(error as Error, { operation: 'fetchRecipeInfo', recipeId });
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
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
      recipes = recipes.filter(r => r.title?.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return { success: true, recipes };
  }

  try {
    log.info('Searching recipes from API', { searchQuery, cuisineFilters, numberOfRecipes });
    let url = `${API_BASE_URL}/complexSearch?apiKey=${API_KEY}&query=${searchQuery}&number=${numberOfRecipes}&addRecipeNutrition=true`;

    if (cuisineFilters.length > 0) {
      url += `&cuisine=${cuisineFilters.join(',')}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    log.info('Recipe search completed', { query: searchQuery, count: data.results?.length });
    return { success: true, recipes: data.results as RecipeSummary[] };
  } catch (error: unknown) {
    log.error('Error searching recipes', error, { searchQuery, cuisineFilters });
    captureException(error as Error, { operation: 'searchRecipes', searchQuery });
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
