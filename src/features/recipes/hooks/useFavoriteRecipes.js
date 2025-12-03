import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import {
  getFavoriteRecipes,
  saveFavoriteRecipe,
  removeFavoriteRecipe,
  subscribeToFavoriteRecipes,
} from '../services/favoriteService';

export const useFavoriteRecipes = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load favorites on mount
  useEffect(() => {
    if (!user?.uid) return;

    const loadFavorites = async () => {
      setLoading(true);
      const result = await getFavoriteRecipes(user.uid);

      if (result.success) {
        setFavorites(result.recipes);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    loadFavorites();
  }, [user?.uid]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToFavoriteRecipes(user.uid, recipes => {
      setFavorites(recipes);
    });

    return unsubscribe;
  }, [user?.uid]);

  const addFavorite = async (recipeId, imageUrl) => {
    if (!user?.uid) return { success: false, error: 'User not authenticated' };

    const result = await saveFavoriteRecipe(user.uid, recipeId, imageUrl);
    return result;
  };

  const removeFavorite = async docId => {
    if (!user?.uid) return { success: false, error: 'User not authenticated' };

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
