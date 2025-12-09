import Constants from 'expo-constants';
import { getMockRecipes, getMockRecipeById } from './mockRecipes';
import FeatureFlags from '@/config/featureFlags';

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
  numberOfRecipes = 1
): Promise<{ success: boolean; recipes?: RecipeSummary[]; error?: string }> => {
  // Use mock data in development
  if (FeatureFlags.USE_MOCK_RECIPES) {
    const mockRecipes = getMockRecipes(numberOfRecipes, cuisineFilters);
    return { success: true, recipes: mockRecipes };
  }

  try {
    let url = `${API_BASE_URL}/complexSearch?apiKey=${API_KEY}&number=${numberOfRecipes}&sort=random&addRecipeNutrition=true`;

    if (cuisineFilters.length > 0) {
      url += `&cuisine=${cuisineFilters.join(',')}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, recipes: data.results as RecipeSummary[] };
  } catch (error: unknown) {
    console.error('Error fetching random recipes:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const fetchRecipeInfo = async (
  recipeId: number
): Promise<{ success: boolean; recipe?: RecipeSummary; error?: string }> => {
  // Use mock data in development
  if (FeatureFlags.USE_MOCK_RECIPES) {
    const mockRecipe = getMockRecipeById(recipeId);
    if (mockRecipe) {
      return { success: true, recipe: mockRecipe };
    }
    return { success: false, error: 'Recipe not found in mock data' };
  }

  try {
    const url = `${API_BASE_URL}/${recipeId}/information?apiKey=${API_KEY}&includeNutrition=true`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as RecipeSummary;
    return { success: true, recipe: data };
  } catch (error: unknown) {
    console.error('Error fetching recipe info:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const searchRecipes = async (
  searchQuery: string,
  cuisineFilters: string[] = [],
  numberOfRecipes = 10
): Promise<{ success: boolean; recipes?: RecipeSummary[]; error?: string }> => {
  // Use mock data in development
  if (FeatureFlags.USE_MOCK_RECIPES) {
    let recipes = getMockRecipes(numberOfRecipes, cuisineFilters);
    if (searchQuery) {
      recipes = recipes.filter(r => r.title?.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return { success: true, recipes };
  }

  try {
    let url = `${API_BASE_URL}/complexSearch?apiKey=${API_KEY}&query=${searchQuery}&number=${numberOfRecipes}&addRecipeNutrition=true`;

    if (cuisineFilters.length > 0) {
      url += `&cuisine=${cuisineFilters.join(',')}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, recipes: data.results as RecipeSummary[] };
  } catch (error: unknown) {
    console.error('Error searching recipes:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
