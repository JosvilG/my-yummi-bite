import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/app/config/firebase';

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
    const ref = favRecipesRef(userId);
    await addDoc(ref, {
      id: recipeId,
      url: imageUrl,
      savedAt: new Date(),
      ...(cuisines && cuisines.length > 0 && { cuisines }),
    });
    return { success: true };
  } catch (error: unknown) {
    console.error('Error saving favorite recipe:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const removeFavoriteRecipe = async (
  userId: string,
  docId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const recipeRef = doc(db, 'users', userId, 'FavRecipes', docId);
    await deleteDoc(recipeRef);
    return { success: true };
  } catch (error: unknown) {
    console.error('Error removing favorite recipe:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const getFavoriteRecipes = async (
  userId: string
): Promise<{ success: boolean; recipes?: FavoriteRecipeDoc[]; error?: string }> => {
  try {
    const q = query(favRecipesRef(userId));
    const querySnapshot = await getDocs(q);

    const recipes: FavoriteRecipeDoc[] = [];
    querySnapshot.forEach(snapshotDoc => {
      const data = snapshotDoc.data();
      recipes.push({ docId: snapshotDoc.id, ...(data as Omit<FavoriteRecipeDoc, 'docId'>) });
    });

    return { success: true, recipes };
  } catch (error: unknown) {
    console.error('Error getting favorite recipes:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
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
