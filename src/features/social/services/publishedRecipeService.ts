import {
  collection,
  doc,
  type DocumentData,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  type QueryDocumentSnapshot,
  startAfter,
  where,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions, storage } from '@/app/config/firebase';
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

type PublishRecipeCallableInput = {
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

type PublishRecipeCallableOutput = {
  id: string;
  imageUrl?: string;
};

type PublishedRecipeActionCallableInput = {
  publishedRecipeId: string;
  active?: boolean;
};

const publishRecipeCallable = httpsCallable<
  PublishRecipeCallableInput,
  PublishRecipeCallableOutput
>(functions, 'publishRecipe');
const setPublishedRecipeLikeCallable = httpsCallable<
  PublishedRecipeActionCallableInput,
  { success: true }
>(functions, 'setPublishedRecipeLike');
const setPublishedRecipeSaveCallable = httpsCallable<
  PublishedRecipeActionCallableInput,
  { success: true }
>(functions, 'setPublishedRecipeSave');
const incrementPublishedRecipeShareCallable = httpsCallable<
  PublishedRecipeActionCallableInput,
  { success: true }
>(functions, 'incrementPublishedRecipeShare');
const deletePublishedRecipeCallable = httpsCallable<
  PublishedRecipeActionCallableInput,
  { success: true }
>(functions, 'deletePublishedRecipe');

const extractCallableErrorMessage = (error: unknown, fallback = 'Unknown error'): string => {
  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
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

    const payload: PublishRecipeCallableInput = {
      title: recipe.title,
      imageUrl,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      readyInMinutes: recipe.readyInMinutes,
      difficulty: recipe.difficulty,
      nutrition: recipe.nutrition,
    };

    const result = await publishRecipeCallable(payload);
    return { success: true, id: result.data.id, imageUrl: result.data.imageUrl ?? imageUrl };
  } catch (error: unknown) {
    const message = extractCallableErrorMessage(error, 'Could not publish recipe');
    captureException(error as Error, { operation: 'publishRecipe' });
    return { success: false, error: message };
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
  savesCount?: number;
  sharesCount?: number;
  likedByMe?: boolean;
  createdAt?: unknown;
};

export type PublishedRecipesPageCursor = QueryDocumentSnapshot<DocumentData>;

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

export const getPublishedRecipesPage = async (
  count = 10,
  cursor?: PublishedRecipesPageCursor
): Promise<{ success: boolean; recipes?: PublishedRecipeDoc[]; cursor?: PublishedRecipesPageCursor; error?: string }> => {
  try {
    const base = [collection(db, 'PublishedRecipes'), orderBy('createdAt', 'desc'), limit(count)] as const;
    const q = cursor ? query(...base, startAfter(cursor)) : query(...base);
    const snapshot = await getDocs(q);

    const recipes: PublishedRecipeDoc[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Omit<PublishedRecipeDoc, 'id'>;
      recipes.push({ id: docSnap.id, ...data });
    });

    const nextCursor = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : cursor;
    return { success: true, recipes, cursor: nextCursor };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, { operation: 'getPublishedRecipesPage' });
    return { success: false, error: errorMessage };
  }
};

export const getPublishedRecipesByAuthors = async (
  authorIds: string[],
  count = 10
): Promise<{ success: boolean; recipes?: PublishedRecipeDoc[]; error?: string }> => {
  try {
    const ids = (authorIds ?? []).filter(Boolean).slice(0, 10);
    if (ids.length === 0) return { success: true, recipes: [] };

    let snapshot;
    try {
      const q = query(
        collection(db, 'PublishedRecipes'),
        where('authorId', 'in', ids),
        orderBy('createdAt', 'desc'),
        limit(count)
      );
      snapshot = await getDocs(q);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      log.warn('getPublishedRecipesByAuthors: falling back query without orderBy', { authorIds: ids, error: message });
      captureException(error as Error, { operation: 'getPublishedRecipesByAuthors_orderBy' });
      const q = query(collection(db, 'PublishedRecipes'), where('authorId', 'in', ids), limit(count));
      snapshot = await getDocs(q);
    }

    const recipes: PublishedRecipeDoc[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Omit<PublishedRecipeDoc, 'id'>;
      recipes.push({ id: docSnap.id, ...data });
    });
    return { success: true, recipes };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, { operation: 'getPublishedRecipesByAuthors' });
    return { success: false, error: errorMessage };
  }
};

export const getPublishedRecipesByAuthorsPage = async (
  authorIds: string[],
  count = 10,
  cursor?: PublishedRecipesPageCursor
): Promise<{ success: boolean; recipes?: PublishedRecipeDoc[]; cursor?: PublishedRecipesPageCursor; error?: string }> => {
  try {
    const ids = (authorIds ?? []).filter(Boolean).slice(0, 10);
    if (ids.length === 0) return { success: true, recipes: [], cursor };

    let snapshot;
    try {
      const base = [
        collection(db, 'PublishedRecipes'),
        where('authorId', 'in', ids),
        orderBy('createdAt', 'desc'),
        limit(count),
      ] as const;
      const q = cursor ? query(...base, startAfter(cursor)) : query(...base);
      snapshot = await getDocs(q);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      log.warn('getPublishedRecipesByAuthorsPage: falling back query without orderBy', { authorIds: ids, error: message });
      captureException(error as Error, { operation: 'getPublishedRecipesByAuthorsPage_orderBy' });
      const base = [collection(db, 'PublishedRecipes'), where('authorId', 'in', ids), limit(count)] as const;
      const q = cursor ? query(...base, startAfter(cursor)) : query(...base);
      snapshot = await getDocs(q);
    }

    const recipes: PublishedRecipeDoc[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Omit<PublishedRecipeDoc, 'id'>;
      recipes.push({ id: docSnap.id, ...data });
    });

    const nextCursor = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : cursor;
    return { success: true, recipes, cursor: nextCursor };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, { operation: 'getPublishedRecipesByAuthorsPage' });
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

export const subscribeToPublishedRecipesByAuthor = (
  authorId: string,
  callback: (result: { success: boolean; recipes?: PublishedRecipeDoc[]; error?: string }) => void,
  count = 50
) => {
  let unsubscribe: (() => void) | null = null;
  let didFallback = false;

  const buildRecipes = (snapshot: any): PublishedRecipeDoc[] => {
    const recipes: PublishedRecipeDoc[] = [];
    snapshot.forEach((docSnap: any) => {
      const data = docSnap.data() as Omit<PublishedRecipeDoc, 'id'>;
      recipes.push({ id: docSnap.id, ...data });
    });
    return recipes;
  };

  const start = (useOrderBy: boolean) => {
    const q = useOrderBy
      ? query(
          collection(db, 'PublishedRecipes'),
          where('authorId', '==', authorId),
          orderBy('createdAt', 'desc'),
          limit(count)
        )
      : query(collection(db, 'PublishedRecipes'), where('authorId', '==', authorId), limit(count));

    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        callback({ success: true, recipes: buildRecipes(snapshot) });
      },
      (error) => {
        const message = error instanceof Error ? error.message : String(error);
        captureException(error as Error, { operation: 'subscribeToPublishedRecipesByAuthor', authorId });

        if (!didFallback && useOrderBy) {
          didFallback = true;
          try {
            unsubscribe?.();
          } catch {
            // ignore
          }
          start(false);
          return;
        }

        callback({ success: false, error: message });
      }
    );
  };

  start(true);
  return () => {
    try {
      unsubscribe?.();
    } catch {
      // ignore
    }
  };
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
    await setPublishedRecipeLikeCallable({ publishedRecipeId, active: like });
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = extractCallableErrorMessage(error, 'Could not update like status');
    captureException(error as Error, { operation: 'setPublishedRecipeLike', userId, publishedRecipeId });
    return { success: false, error: errorMessage };
  }
};

export const hasUserSavedPublishedRecipe = async (
  publishedRecipeId: string,
  userId: string
): Promise<{ success: boolean; saved?: boolean; error?: string }> => {
  try {
    const saveRef = doc(db, 'PublishedRecipes', publishedRecipeId, 'saves', userId);
    const snap = await getDoc(saveRef);
    return { success: true, saved: snap.exists() };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, { operation: 'hasUserSavedPublishedRecipe', userId, publishedRecipeId });
    return { success: false, error: errorMessage };
  }
};

export const setPublishedRecipeSave = async (
  publishedRecipeId: string,
  userId: string,
  save: boolean
): Promise<{ success: boolean; error?: string }> => {
  try {
    await setPublishedRecipeSaveCallable({ publishedRecipeId, active: save });
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = extractCallableErrorMessage(error, 'Could not update save status');
    captureException(error as Error, { operation: 'setPublishedRecipeSave', userId, publishedRecipeId });
    return { success: false, error: errorMessage };
  }
};

export const incrementPublishedRecipeShare = async (
  publishedRecipeId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await incrementPublishedRecipeShareCallable({ publishedRecipeId });
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = extractCallableErrorMessage(error, 'Could not increment share count');
    captureException(error as Error, { operation: 'incrementPublishedRecipeShare', publishedRecipeId });
    return { success: false, error: errorMessage };
  }
};

export const deletePublishedRecipe = async (
  publishedRecipeId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await deletePublishedRecipeCallable({ publishedRecipeId });
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = extractCallableErrorMessage(error, 'Could not delete recipe');
    captureException(error as Error, { operation: 'deletePublishedRecipe', publishedRecipeId });
    return { success: false, error: errorMessage };
  }
};
