import { makeAutoObservable, runInAction } from 'mobx';
import {
  fetchRandomRecipes,
  fetchRecipeInfo,
  type RecipeSummary,
} from '../services/spoonacularService';

interface FavoriteRecipeEntry {
  id: number;
  img: string;
}

interface RecipeCategoryEntry {
  recipe: number;
  category: string;
  image?: string;
}

class RecipeStore {
  randomRecipe: RecipeSummary[] | null = null;
  favRecipes: FavoriteRecipeEntry[] = [];
  filters: string[] = [];
  recipeInfo: RecipeSummary | null = null;
  categories: string[] = [];
  activeCategory: string | null = null;
  recipesWithCategories: RecipeCategoryEntry[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async loadRandomRecipe() {
    this.loading = true;
    this.error = null;

    const result = await fetchRandomRecipes(this.filters, 1);

    runInAction(() => {
      if (result.success) {
        this.randomRecipe = result.recipes ?? null;
      } else {
        this.error = result.error ?? null;
        this.randomRecipe = null;
      }
      this.loading = false;
    });
  }

  async loadRecipeInfo(recipeId: number) {
    this.loading = true;
    this.error = null;

    const result = await fetchRecipeInfo(recipeId);

    runInAction(() => {
      if (result.success) {
        this.recipeInfo = result.recipe ?? null;
      } else {
        this.error = result.error ?? null;
        this.recipeInfo = null;
      }
      this.loading = false;
    });
  }

  setRandomRecipe(recipe: RecipeSummary[] | null) {
    this.randomRecipe = recipe;
  }

  addFavRecipe(id: number, image: string) {
    this.favRecipes.push({ id, img: image });
  }

  removeFavRecipe(recipe: FavoriteRecipeEntry) {
    const index = this.favRecipes.indexOf(recipe);
    if (index > -1) {
      this.favRecipes.splice(index, 1);
    }
  }

  addFilter(filter: string) {
    if (!this.filters.includes(filter)) {
      this.filters.push(filter);
    }
  }

  removeFilter(filter: string) {
    this.filters = this.filters.filter(item => item !== filter);
  }

  addCategory(category: string) {
    if (!this.categories.includes(category)) {
      this.categories.push(category);
    }
  }

  removeCategory(category: string) {
    this.categories = this.categories.filter(item => item !== category);
  }

  setActiveCategory(category: string | null) {
    this.activeCategory = category;
  }

  setRecipeCategory(recipe: number, category: string, image?: string) {
    const existingIndex = this.recipesWithCategories.findIndex(item => item.recipe === recipe);

    if (existingIndex > -1) {
      this.recipesWithCategories[existingIndex].category = category;
    } else {
      this.recipesWithCategories.push({
        recipe,
        category,
        image,
      });
    }
  }

  clearRecipeInfo() {
    this.recipeInfo = null;
  }

  reset() {
    this.randomRecipe = null;
    this.favRecipes = [];
    this.filters = [];
    this.recipeInfo = null;
    this.categories = [];
    this.activeCategory = null;
    this.recipesWithCategories = [];
    this.loading = false;
    this.error = null;
  }
}

const recipeStore = new RecipeStore();

export default recipeStore;
export type { RecipeStore };
