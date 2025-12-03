import { makeAutoObservable, runInAction } from 'mobx';
import { fetchRandomRecipes, fetchRecipeInfo } from '../services/spoonacularService';

class RecipeStore {
  randomRecipe = null;
  favRecipes = [];
  filters = [];
  recipeInfo = null;
  categories = [];
  activeCategory = null;
  recipesWithCategories = [];
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async loadRandomRecipe() {
    this.loading = true;
    this.error = null;

    const result = await fetchRandomRecipes(this.filters, 1);

    runInAction(() => {
      if (result.success) {
        this.randomRecipe = result.recipes;
      } else {
        this.error = result.error;
        this.randomRecipe = null;
      }
      this.loading = false;
    });
  }

  async loadRecipeInfo(recipeId) {
    this.loading = true;
    this.error = null;

    const result = await fetchRecipeInfo(recipeId);

    runInAction(() => {
      if (result.success) {
        this.recipeInfo = result.recipe;
      } else {
        this.error = result.error;
        this.recipeInfo = null;
      }
      this.loading = false;
    });
  }

  setRandomRecipe(recipe) {
    this.randomRecipe = recipe;
  }

  addFavRecipe(id, image) {
    this.favRecipes.push({ id, img: image });
  }

  removeFavRecipe(recipe) {
    const index = this.favRecipes.indexOf(recipe);
    if (index > -1) {
      this.favRecipes.splice(index, 1);
    }
  }

  addFilter(filter) {
    if (!this.filters.includes(filter)) {
      this.filters.push(filter);
    }
  }

  removeFilter(filter) {
    this.filters = this.filters.filter(item => item !== filter);
  }

  addCategory(category) {
    if (!this.categories.includes(category)) {
      this.categories.push(category);
    }
  }

  removeCategory(category) {
    this.categories = this.categories.filter(item => item !== category);
  }

  setActiveCategory(category) {
    this.activeCategory = category;
  }

  setRecipeCategory(recipe, category, image) {
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
