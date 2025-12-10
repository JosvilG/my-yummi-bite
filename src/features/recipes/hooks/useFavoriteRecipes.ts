import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import {
  getFavoriteRecipes,
  saveFavoriteRecipe,
  removeFavoriteRecipe,
  subscribeToFavoriteRecipes,
  type FavoriteRecipeDoc,
} from '../services/favoriteService';
import { log } from '@/lib/logger';

export const useFavoriteRecipes = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteRecipeDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) return;

    const loadFavorites = async () => {
      log.debug('useFavoriteRecipes: Loading favorites', { userId: user.uid });
      setLoading(true);
      const result = await getFavoriteRecipes(user.uid);

      if (result.success && result.recipes) {
        setFavorites(result.recipes);
        log.info('useFavoriteRecipes: Favorites loaded', { count: result.recipes.length });
      } else {
        setError(result.error ?? null);
        log.warn('useFavoriteRecipes: Failed to load favorites', { error: result.error });
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
    if (!user?.uid) {
      log.warn('useFavoriteRecipes: Cannot add favorite - not authenticated');
      return { success: false, error: 'User not authenticated' } as const;
    }

    log.info('useFavoriteRecipes: Adding favorite', { recipeId });
    const result = await saveFavoriteRecipe(user.uid, recipeId, imageUrl);
    return result;
  };

  const removeFavorite = async (docId: string) => {
    if (!user?.uid) {
      log.warn('useFavoriteRecipes: Cannot remove favorite - not authenticated');
      return { success: false, error: 'User not authenticated' } as const;
    }

    log.info('useFavoriteRecipes: Removing favorite', { docId });
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
