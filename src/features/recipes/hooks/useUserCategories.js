import { useEffect, useState } from 'react';
import { createCategory, listenToCategories, removeCategory } from '../services/categoryService';

export const useUserCategories = userId => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const addCategory = async name => {
    try {
      await createCategory(userId, name);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteCategory = async categoryId => {
    try {
      await removeCategory(userId, categoryId);
    } catch (err) {
      setError(err.message);
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
