import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, serverTimestamp, storage } from '@/app/config/firebase';
import { captureException } from '@/lib/sentry';
import { log } from '@/lib/logger';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export type PublishedRecipeInput = {
  authorId: string;
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

const shouldUploadImage = (imageUrlOrUri: string): boolean => {
  const value = String(imageUrlOrUri || '').trim().toLowerCase();
  if (!value) return false;
  return !value.startsWith('http://') && !value.startsWith('https://');
};

export const uploadPublishedRecipeImage = async (
  authorId: string,
  localUri: string
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const response = await fetch(localUri);
    const blob = await response.blob();
    const ext = localUri.toLowerCase().includes('.png') ? 'png' : 'jpg';
    const fileRef = ref(storage, `public/recipes/${authorId}/${Date.now()}.${ext}`);
    await uploadBytes(fileRef, blob, { contentType: ext === 'png' ? 'image/png' : 'image/jpeg' });
    const url = await getDownloadURL(fileRef);
    return { success: true, url };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, { operation: 'uploadPublishedRecipeImage', authorId });
    return { success: false, error: errorMessage };
  }
};

export const publishRecipe = async (
  recipe: PublishedRecipeInput
): Promise<{ success: boolean; id?: string; imageUrl?: string; error?: string }> => {
  try {
    log.info('Publishing recipe', { authorId: recipe.authorId, title: recipe.title });

    let imageUrl = recipe.imageUrl;
    if (shouldUploadImage(imageUrl)) {
      const upload = await uploadPublishedRecipeImage(recipe.authorId, imageUrl);
      if (!upload.success || !upload.url) {
        return { success: false, error: upload.error ?? 'Image upload failed' };
      }
      imageUrl = upload.url;
    }

    const ref = collection(db, 'PublishedRecipes');
    const docRef = await addDoc(ref, {
      authorId: recipe.authorId,
      title: recipe.title,
      imageUrl,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      ...(typeof recipe.readyInMinutes === 'number' && { readyInMinutes: recipe.readyInMinutes }),
      ...(recipe.difficulty && { difficulty: recipe.difficulty }),
      ...(recipe.nutrition && { nutrition: recipe.nutrition }),
      likesCount: 0,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id, imageUrl };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, { operation: 'publishRecipe', authorId: recipe.authorId });
    return { success: false, error: errorMessage };
  }
};

export type PublishedRecipeDoc = {
  id: string;
  authorId: string;
  title: string;
  imageUrl: string;
  ingredients: string[];
  steps: string[];
  readyInMinutes?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  likesCount: number;
  likedByMe?: boolean;
};

export const getPublishedRecipes = async (
  count = 10
): Promise<{ success: boolean; recipes?: PublishedRecipeDoc[]; error?: string }> => {
  try {
    const q = query(collection(db, 'PublishedRecipes'), orderBy('createdAt', 'desc'), limit(count));
    const snapshot = await getDocs(q);

    const recipes: PublishedRecipeDoc[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Omit<PublishedRecipeDoc, 'id'>;
      recipes.push({ id: docSnap.id, ...data });
    });
    return { success: true, recipes };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, { operation: 'getPublishedRecipes' });
    return { success: false, error: errorMessage };
  }
};

export const getPublishedRecipesByAuthor = async (
  authorId: string,
  count = 50
): Promise<{ success: boolean; recipes?: PublishedRecipeDoc[]; error?: string }> => {
  try {
    let snapshot;
    try {
      const q = query(
        collection(db, 'PublishedRecipes'),
        where('authorId', '==', authorId),
        orderBy('createdAt', 'desc'),
        limit(count)
      );
      snapshot = await getDocs(q);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      log.warn('getPublishedRecipesByAuthor: falling back query without orderBy', { authorId, error: message });
      captureException(error as Error, { operation: 'getPublishedRecipesByAuthor_orderBy', authorId });

      const fallback = query(
        collection(db, 'PublishedRecipes'),
        where('authorId', '==', authorId),
        limit(count)
      );
      snapshot = await getDocs(fallback);
    }

    const recipes: PublishedRecipeDoc[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Omit<PublishedRecipeDoc, 'id'>;
      recipes.push({ id: docSnap.id, ...data });
    });
    return { success: true, recipes };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, { operation: 'getPublishedRecipesByAuthor', authorId });
    return { success: false, error: errorMessage };
  }
};

export const getPublishedRecipeById = async (
  publishedRecipeId: string
): Promise<{ success: boolean; recipe?: PublishedRecipeDoc; error?: string }> => {
  try {
    const recipeRef = doc(db, 'PublishedRecipes', publishedRecipeId);
    const snap = await getDoc(recipeRef);
    if (!snap.exists()) {
      return { success: false, error: 'Recipe not found' };
    }

    const data = snap.data() as Omit<PublishedRecipeDoc, 'id'>;
    return { success: true, recipe: { id: snap.id, ...data } };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, { operation: 'getPublishedRecipeById', publishedRecipeId });
    return { success: false, error: errorMessage };
  }
};

export const hasUserLikedPublishedRecipe = async (
  publishedRecipeId: string,
  userId: string
): Promise<{ success: boolean; liked?: boolean; error?: string }> => {
  try {
    const likeRef = doc(db, 'PublishedRecipes', publishedRecipeId, 'likes', userId);
    const snap = await getDoc(likeRef);
    return { success: true, liked: snap.exists() };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, { operation: 'hasUserLikedPublishedRecipe', userId, publishedRecipeId });
    return { success: false, error: errorMessage };
  }
};

export const setPublishedRecipeLike = async (
  publishedRecipeId: string,
  userId: string,
  like: boolean
): Promise<{ success: boolean; error?: string }> => {
  try {
    const recipeRef = doc(db, 'PublishedRecipes', publishedRecipeId);
    const likeRef = doc(db, 'PublishedRecipes', publishedRecipeId, 'likes', userId);

    if (like) {
      await setDoc(likeRef, { createdAt: serverTimestamp() });
      await updateDoc(recipeRef, { likesCount: increment(1) });
    } else {
      await deleteDoc(likeRef);
      await updateDoc(recipeRef, { likesCount: increment(-1) });
    }
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, { operation: 'setPublishedRecipeLike', userId, publishedRecipeId });
    return { success: false, error: errorMessage };
  }
};
