import React from 'react';
import { AuthProvider } from './AuthProvider';
import { RecipeProvider } from './RecipeProvider';

const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <RecipeProvider>{children}</RecipeProvider>
    </AuthProvider>
  );
};

export default AppProviders;
