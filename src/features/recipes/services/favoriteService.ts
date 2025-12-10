import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  onSnapshot,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/app/config/firebase';
import { captureException } from '@/lib/sentry';
import { log } from '@/lib/logger';

export interface FavoriteRecipeDoc {
  docId: string;
  id: number;
  url: string;
  savedAt?: Timestamp | Date;
  category?: string;
  cuisines?: string[];
}

const favRecipesRef = (userId: string) => collection(db, 'users', userId, 'FavRecipes');

export const saveFavoriteRecipe = async (
  userId: string,
  recipeId: number,
  imageUrl: string,
  cuisines?: string[]
): Promise<{ success: boolean; error?: string }> => {
  try {
    log.info('Saving favorite recipe', { userId, recipeId });
    
    const ref = favRecipesRef(userId);
    await addDoc(ref, {
      id: recipeId,
      url: imageUrl,
      savedAt: new Date(),
      ...(cuisines && cuisines.length > 0 && { cuisines }),
    });
    
    log.info('Favorite recipe saved successfully', { userId, recipeId });
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, {
      operation: 'saveFavoriteRecipe',
      userId,
      recipeId,
    });
    return { success: false, error: errorMessage };
  }
};

export const removeFavoriteRecipe = async (
  userId: string,
  docId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    log.info('Removing favorite recipe', { userId, docId });
    
    const recipeRef = doc(db, 'users', userId, 'FavRecipes', docId);
    await deleteDoc(recipeRef);
    
    log.info('Favorite recipe removed successfully', { userId, docId });
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, {
      operation: 'removeFavoriteRecipe',
      userId,
      docId,
    });
    return { success: false, error: errorMessage };
  }
};

export const getFavoriteRecipes = async (
  userId: string
): Promise<{ success: boolean; recipes?: FavoriteRecipeDoc[]; error?: string }> => {
  try {
    log.debug('Fetching favorite recipes', { userId });
    
    const q = query(favRecipesRef(userId));
    const querySnapshot = await getDocs(q);

    const recipes: FavoriteRecipeDoc[] = [];
    querySnapshot.forEach(snapshotDoc => {
      const data = snapshotDoc.data();
      recipes.push({ docId: snapshotDoc.id, ...(data as Omit<FavoriteRecipeDoc, 'docId'>) });
    });

    log.info('Favorite recipes fetched successfully', { userId, count: recipes.length });
    return { success: true, recipes };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, {
      operation: 'getFavoriteRecipes',
      userId,
    });
    return { success: false, error: errorMessage };
  }
};

export const subscribeToFavoriteRecipes = (
  userId: string,
  callback: (recipes: FavoriteRecipeDoc[]) => void
) => {
  return onSnapshot(favRecipesRef(userId), snapshot => {
    const recipes: FavoriteRecipeDoc[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      recipes.push({ docId: docSnap.id, ...(data as Omit<FavoriteRecipeDoc, 'docId'>) });
    });
    callback(recipes);
  });
};

export const updateRecipeCategory = async (
  userId: string,
  docId: string,
  category: string | null
): Promise<{ success: boolean; error?: string }> => {
  try {
    const recipeRef = doc(db, 'users', userId, 'FavRecipes', docId);
    if (category) {
      await updateDoc(recipeRef, { category });
    } else {
      await updateDoc(recipeRef, { category: null });
    }
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, {
      operation: 'updateRecipeCategory',
      userId,
      docId,
      category,
    });
    return { success: false, error: errorMessage };
  }
};
