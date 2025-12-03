import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/app/config/firebase';

/**
 * Save a favorite recipe to Firestore
 */
export const saveFavoriteRecipe = async (userId, recipeId, imageUrl) => {
  try {
    const favRecipesRef = collection(db, 'users', userId, 'FavRecipes');
    await addDoc(favRecipesRef, {
      id: recipeId,
      url: imageUrl,
      savedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error saving favorite recipe:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Remove a favorite recipe from Firestore
 */
export const removeFavoriteRecipe = async (userId, docId) => {
  try {
    const recipeRef = doc(db, 'users', userId, 'FavRecipes', docId);
    await deleteDoc(recipeRef);
    return { success: true };
  } catch (error) {
    console.error('Error removing favorite recipe:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all favorite recipes for a user
 */
export const getFavoriteRecipes = async userId => {
  try {
    const favRecipesRef = collection(db, 'users', userId, 'FavRecipes');
    const q = query(favRecipesRef);
    const querySnapshot = await getDocs(q);

    const recipes = [];
    querySnapshot.forEach(doc => {
      recipes.push({ docId: doc.id, ...doc.data() });
    });

    return { success: true, recipes };
  } catch (error) {
    console.error('Error getting favorite recipes:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Subscribe to favorite recipes changes
 */
export const subscribeToFavoriteRecipes = (userId, callback) => {
  const favRecipesRef = collection(db, 'users', userId, 'FavRecipes');
  return onSnapshot(favRecipesRef, snapshot => {
    const recipes = [];
    snapshot.forEach(doc => {
      recipes.push({ docId: doc.id, ...doc.data() });
    });
    callback(recipes);
  });
};
