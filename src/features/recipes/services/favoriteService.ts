import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  onSnapshot,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  limit,
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
  source?: 'spoonacular' | 'custom' | 'published';
  publishedId?: string;
  title?: string;
  ingredients?: string[];
  steps?: string[];
  readyInMinutes?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  nutrition?: {
    calories?: string;
    protein?: string;
    fat?: string;
    carbs?: string;
  };
}

const favRecipesRef = (userId: string) => collection(db, 'users', userId, 'FavRecipes');
const favRecipeDocRef = (userId: string, docId: string) => doc(db, 'users', userId, 'FavRecipes', docId);

const spoonacularFavDocId = (recipeId: number) => `spoonacular_${recipeId}`;
const publishedFavDocId = (publishedId: string) => `published_${publishedId}`;

export type CustomFavoriteRecipeInput = {
  title: string;
  imageUrl: string;
  ingredients: string[];
  steps: string[];
  readyInMinutes?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  nutrition?: {
    calories?: string;
    protein?: string;
    fat?: string;
    carbs?: string;
  };
};

export type PublishedFavoriteRecipeInput = {
  publishedId: string;
  title: string;
  imageUrl: string;
  ingredients: string[];
  steps: string[];
  readyInMinutes?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  nutrition?: {
    calories?: string;
    protein?: string;
    fat?: string;
    carbs?: string;
  };
};

export const saveFavoriteRecipe = async (
  userId: string,
  recipeId: number,
  imageUrl: string,
  cuisines?: string[]
): Promise<{ success: boolean; error?: string }> => {
  try {
    log.info('Saving favorite recipe', { userId, recipeId });
    
    const recipeRef = favRecipeDocRef(userId, spoonacularFavDocId(recipeId));
    await setDoc(
      recipeRef,
      {
      id: recipeId,
      url: imageUrl,
      savedAt: new Date(),
      source: 'spoonacular',
      ...(cuisines && cuisines.length > 0 && { cuisines }),
      },
      { merge: true }
    );
    
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

export const saveCustomFavoriteRecipe = async (
  userId: string,
  customRecipe: CustomFavoriteRecipeInput
): Promise<{ success: boolean; error?: string }> => {
  try {
    const recipeId = Date.now();
    log.info('Saving custom favorite recipe', { userId, recipeId });

    const recipeRef = favRecipeDocRef(userId, `custom_${recipeId}`);
    await setDoc(
      recipeRef,
      {
        id: recipeId,
        url: customRecipe.imageUrl,
        savedAt: new Date(),
        source: 'custom',
        title: customRecipe.title,
        ingredients: customRecipe.ingredients,
        steps: customRecipe.steps,
        ...(typeof customRecipe.readyInMinutes === 'number' && { readyInMinutes: customRecipe.readyInMinutes }),
        ...(customRecipe.difficulty && { difficulty: customRecipe.difficulty }),
        ...(customRecipe.nutrition && { nutrition: customRecipe.nutrition }),
      },
      { merge: true }
    );

    log.info('Custom favorite recipe saved successfully', { userId, recipeId });
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, {
      operation: 'saveCustomFavoriteRecipe',
      userId,
    });
    return { success: false, error: errorMessage };
  }
};

export const savePublishedFavoriteRecipe = async (
  userId: string,
  publishedRecipe: PublishedFavoriteRecipeInput
): Promise<{ success: boolean; error?: string }> => {
  try {
    log.info('Saving published recipe as favorite', { userId, publishedId: publishedRecipe.publishedId });

    const recipeRef = favRecipeDocRef(userId, publishedFavDocId(publishedRecipe.publishedId));
    await setDoc(
      recipeRef,
      {
        id: Date.now(),
        url: publishedRecipe.imageUrl,
        savedAt: new Date(),
        source: 'published',
        publishedId: publishedRecipe.publishedId,
        title: publishedRecipe.title,
        ingredients: publishedRecipe.ingredients,
        steps: publishedRecipe.steps,
        ...(typeof publishedRecipe.readyInMinutes === 'number' && { readyInMinutes: publishedRecipe.readyInMinutes }),
        ...(publishedRecipe.difficulty && { difficulty: publishedRecipe.difficulty }),
        ...(publishedRecipe.nutrition && { nutrition: publishedRecipe.nutrition }),
      },
      { merge: true }
    );

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, {
      operation: 'savePublishedFavoriteRecipe',
      userId,
      publishedId: publishedRecipe.publishedId,
    });
    return { success: false, error: errorMessage };
  }
};

export const isPublishedFavoriteRecipeSaved = async (
  userId: string,
  publishedId: string
): Promise<{ success: boolean; saved?: boolean; error?: string }> => {
  try {
    const recipeRef = favRecipeDocRef(userId, publishedFavDocId(publishedId));
    const existing = await getDoc(recipeRef);
    return { success: true, saved: existing.exists() };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, { operation: 'isPublishedFavoriteRecipeSaved', userId, publishedId });
    return { success: false, error: errorMessage };
  }
};

export const togglePublishedFavoriteRecipe = async (
  userId: string,
  publishedRecipe: PublishedFavoriteRecipeInput
): Promise<{ success: boolean; favorited?: boolean; error?: string }> => {
  try {
    const recipeRef = favRecipeDocRef(userId, publishedFavDocId(publishedRecipe.publishedId));
    const existing = await getDoc(recipeRef);
    if (existing.exists()) {
      await deleteDoc(recipeRef);
      return { success: true, favorited: false };
    }

    await setDoc(
      recipeRef,
      {
        id: Date.now(),
        url: publishedRecipe.imageUrl,
        savedAt: new Date(),
        source: 'published',
        publishedId: publishedRecipe.publishedId,
        title: publishedRecipe.title,
        ingredients: publishedRecipe.ingredients,
        steps: publishedRecipe.steps,
        ...(typeof publishedRecipe.readyInMinutes === 'number' && { readyInMinutes: publishedRecipe.readyInMinutes }),
        ...(publishedRecipe.difficulty && { difficulty: publishedRecipe.difficulty }),
        ...(publishedRecipe.nutrition && { nutrition: publishedRecipe.nutrition }),
      },
      { merge: true }
    );

    return { success: true, favorited: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, { operation: 'togglePublishedFavoriteRecipe', userId, publishedId: publishedRecipe.publishedId });
    return { success: false, error: errorMessage };
  }
};

export const removeFavoriteRecipe = async (
  userId: string,
  docId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    log.info('Removing favorite recipe', { userId, docId });
    
    const recipeRef = favRecipeDocRef(userId, docId);
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
