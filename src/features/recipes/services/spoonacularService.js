import Constants from 'expo-constants';

const API_BASE_URL = 'https://api.spoonacular.com/recipes';
const API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_SPOONACULAR_API_KEY || process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY;

/**
 * Fetch random recipes with optional cuisine filters
 */
export const fetchRandomRecipes = async (cuisineFilters = [], numberOfRecipes = 1) => {
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
    return { success: true, recipes: data.results };
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Fetch detailed information about a specific recipe
 */
export const fetchRecipeInfo = async recipeId => {
  try {
    const url = `${API_BASE_URL}/${recipeId}/information?apiKey=${API_KEY}&includeNutrition=true`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, recipe: data };
  } catch (error) {
    console.error('Error fetching recipe info:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Search recipes by query
 */
export const searchRecipes = async (searchQuery, cuisineFilters = [], numberOfRecipes = 10) => {
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
    return { success: true, recipes: data.results };
  } catch (error) {
    console.error('Error searching recipes:', error);
    return { success: false, error: error.message };
  }
};
