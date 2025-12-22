import recipeStore, { RecipeStore } from '../RecipeStore';
import * as spoonacularService from '../../services/spoonacularService';
import { runInAction } from 'mobx';

// Mock spoonacularService
jest.mock('../../services/spoonacularService');
jest.mock('@/lib/logger');

describe('RecipeStore', () => {
  beforeEach(() => {
    recipeStore.reset();
    jest.clearAllMocks();
  });

  describe('Filters and Types', () => {
    it('sets meal type', () => {
      runInAction(() => {
        recipeStore.setMealType('breakfast');
      });
      expect(recipeStore.mealType).toBe('breakfast');
    });

    it('adds and removes filter', () => {
      runInAction(() => {
        recipeStore.addFilter('vegan');
      });
      expect(recipeStore.filters).toContain('vegan');
      
      runInAction(() => {
        recipeStore.removeFilter('vegan');
      });
      expect(recipeStore.filters).not.toContain('vegan');
    });

    it('avoids duplicate filters', () => {
       runInAction(() => {
           recipeStore.addFilter('keto');
           recipeStore.addFilter('keto');
       });
       expect(recipeStore.filters.filter(f => f === 'keto').length).toBe(1);
    });
  });

  describe('Async Actions', () => {
    it('loadRandomRecipe updates state on success', async () => {
      const mockRecipes = [{ id: 1, title: 'Toast' }];
      (spoonacularService.fetchRandomRecipes as jest.Mock).mockResolvedValue({ 
          success: true, 
          recipes: mockRecipes 
      });

      await recipeStore.loadRandomRecipe();

      expect(recipeStore.loading).toBe(false);
      expect(recipeStore.randomRecipe).toEqual(mockRecipes);
      expect(recipeStore.error).toBeNull();
    });

    it('loadRandomRecipe updates state on failure', async () => {
      (spoonacularService.fetchRandomRecipes as jest.Mock).mockResolvedValue({ 
          success: false, 
          error: 'Network error' 
      });

      await recipeStore.loadRandomRecipe();

      expect(recipeStore.loading).toBe(false);
      expect(recipeStore.randomRecipe).toBeNull();
      expect(recipeStore.error).toBe('Network error');
    });

    it('loadRecipeInfo updates state on success', async () => {
       const mockRecipe = { id: 100, title: 'Soup' };
       (spoonacularService.fetchRecipeInfo as jest.Mock).mockResolvedValue({
           success: true,
           recipe: mockRecipe
       });

       await recipeStore.loadRecipeInfo(100);

       expect(recipeStore.recipeInfo).toEqual(mockRecipe);
       expect(recipeStore.error).toBeNull();
    });
  });

  describe('Favorites and Categories', () => {
     it('adds favorite recipe', () => {
         runInAction(() => {
             recipeStore.addFavRecipe(1, 'img.jpg');
         });
         expect(recipeStore.favRecipes).toHaveLength(1);
         expect(recipeStore.favRecipes[0].id).toBe(1);
     });
     
     // Note: removeFavRecipe uses object reference indexOf, so we need to pass the same object reference
     // or rewrite store to use ID. Store implementation: this.favRecipes.indexOf(recipe)
     it('removes favorite recipe', () => {
         let recipeObj: any;
         runInAction(() => {
             recipeStore.addFavRecipe(2, 'img2.jpg');
             recipeObj = recipeStore.favRecipes[0];
         });
         
         runInAction(() => {
             recipeStore.removeFavRecipe(recipeObj);
         });
         expect(recipeStore.favRecipes).toHaveLength(0);
     });

     it('manages active category', () => {
         runInAction(() => {
             recipeStore.setActiveCategory('Dinner');
         });
         expect(recipeStore.activeCategory).toBe('Dinner');
     });
  });
});
