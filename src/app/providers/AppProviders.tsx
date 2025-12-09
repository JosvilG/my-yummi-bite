import React from 'react';
import { RecipeProvider } from './RecipeProvider';
import { AuthProvider } from './AuthProvider';

interface Props {
  children: React.ReactNode;
}

const AppProviders: React.FC<Props> = ({ children }) => {
  return (
    <AuthProvider>
      <RecipeProvider>{children}</RecipeProvider>
    </AuthProvider>
  );
};

export default AppProviders;
