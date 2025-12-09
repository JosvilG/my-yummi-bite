import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import {
  getFavoriteRecipes,
  saveFavoriteRecipe,
  removeFavoriteRecipe,
  subscribeToFavoriteRecipes,
  type FavoriteRecipeDoc,
} from '../services/favoriteService';

export const useFavoriteRecipes = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteRecipeDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) return;

    const loadFavorites = async () => {
      setLoading(true);
      const result = await getFavoriteRecipes(user.uid);

      if (result.success && result.recipes) {
        setFavorites(result.recipes);
      } else {
        setError(result.error ?? null);
      }
      setLoading(false);
    };

    loadFavorites();
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToFavoriteRecipes(user.uid, recipes => {
      setFavorites(recipes);
    });

    return unsubscribe;
  }, [user?.uid]);

  const addFavorite = async (recipeId: number, imageUrl: string) => {
    if (!user?.uid) return { success: false, error: 'User not authenticated' } as const;

    const result = await saveFavoriteRecipe(user.uid, recipeId, imageUrl);
    return result;
  };

  const removeFavorite = async (docId: string) => {
    if (!user?.uid) return { success: false, error: 'User not authenticated' } as const;

    const result = await removeFavoriteRecipe(user.uid, docId);
    return result;
  };

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
  };
};
