import React, { createContext, useContext } from 'react';
import recipeStore from '@/features/recipes/store/RecipeStore';

const RecipeContext = createContext<typeof recipeStore | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export const RecipeProvider: React.FC<Props> = ({ children }) => {
  return <RecipeContext.Provider value={recipeStore}>{children}</RecipeContext.Provider>;
};

export const useRecipeStore = (): typeof recipeStore => {
  const context = useContext(RecipeContext);

  if (!context) {
    throw new Error('useRecipeStore must be used within a RecipeProvider');
  }

  return context;
};
