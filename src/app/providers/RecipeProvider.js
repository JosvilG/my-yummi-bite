import React, { createContext, useContext } from 'react';
import recipeStore from '@/features/recipes/store/RecipeStore';

const RecipeContext = createContext(recipeStore);

export const RecipeProvider = ({ children }) => {
  return <RecipeContext.Provider value={recipeStore}>{children}</RecipeContext.Provider>;
};

export const useRecipeStore = () => {
  const context = useContext(RecipeContext);

  if (!context) {
    throw new Error('useRecipeStore must be used within a RecipeProvider');
  }

  return context;
};
