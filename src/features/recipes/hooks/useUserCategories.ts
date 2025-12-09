import { useEffect, useState } from 'react';
import {
  createCategory,
  listenToCategories,
  removeCategory,
  type UserCategory,
} from '../services/categoryService';

export const useUserCategories = (userId?: string) => {
  const [categories, setCategories] = useState<UserCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    const unsubscribe = listenToCategories(userId, nextCategories => {
      setCategories(nextCategories);
      setLoading(false);
    });

    return () => {
      unsubscribe?.();
      setLoading(false);
    };
  }, [userId]);

  const addCategory = async (name: string) => {
    try {
      if (!userId) throw new Error('User not authenticated');
      await createCategory(userId, name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      if (!userId) throw new Error('User not authenticated');
      await removeCategory(userId, categoryId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    deleteCategory,
  };
};
