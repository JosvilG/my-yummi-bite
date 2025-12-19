import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions/v1';

const REGION = 'us-central1';
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';
const MIN_RECIPES = 1;
const MAX_RANDOM_RECIPES = 20;
const MAX_SEARCH_RECIPES = 50;
const spoonacularRuntime = functions.region(REGION).runWith({ secrets: ['SPOONACULAR_API_KEY'] });
const PUBLISHED_COLLECTION = 'PublishedRecipes';
const LIKES_SUBCOLLECTION = 'likes';
const SAVES_SUBCOLLECTION = 'saves';

admin.initializeApp();
const db = admin.firestore();

type QueryValue = string | string[] | undefined;

const toSingleString = (value: unknown): string | undefined => {
  if (Array.isArray(value)) {
    return toSingleString(value[0]);
  }
  if (typeof value === 'string') {
    return value;
  }
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value === 'object') {
    return String(value);
  }
  return undefined;
};

const parseCuisineFilters = (value: unknown): string | undefined => {
  const raw = toSingleString(value)?.trim();
  if (!raw) return undefined;
  const normalized = raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .slice(0, 5);
  return normalized.length ? normalized.join(',') : undefined;
};

const parseNumberParam = (
  value: unknown,
  fallback: number,
  min: number,
  max: number
): number => {
  const raw = toSingleString(value);
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(Math.trunc(parsed), min), max);
};

const getMealTypeParams = (value: unknown): { diet?: string; type?: string } => {
  const raw = toSingleString(value)?.trim().toLowerCase();
  if (!raw) return {};
  if (raw === 'vegetarian') {
    return { diet: 'vegetarian' };
  }
  return { type: raw };
};

const getConfigKey = (): string | undefined => {
  try {
    const configAccessor = (functions as any).config as (() => Record<string, unknown>) | undefined;
    if (typeof configAccessor !== 'function') {
      return undefined;
    }

    const configValue = configAccessor();
    const key = (configValue?.spoonacular as Record<string, unknown> | undefined)?.key;
    return typeof key === 'string' ? key.trim() : undefined;
  } catch {
    return undefined;
  }
};

const getApiKey = (): string => {
  const envKey = process.env.SPOONACULAR_API_KEY?.trim();
  const configKey = getConfigKey();
  const key = envKey || configKey;
  if (!key) {
    functions.logger.error('Missing SPOONACULAR API key (env or functions config)');
    throw new Error('SPOONACULAR API key is not configured');
  }
  functions.logger.info('Spoonacular key resolved', {
    hasEnvKey: Boolean(envKey),
    hasConfigKey: Boolean(configKey),
    source: envKey ? 'env' : 'config',
  });
  return key;
};

const callSpoonacular = async (path: string, params: Record<string, string | undefined>) => {
  const url = new URL(`${SPOONACULAR_BASE_URL}/${path}`);
  url.searchParams.set('apiKey', getApiKey());
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Spoonacular returned ${response.status}: ${text ? text.slice(0, 512) : 'no message'}`
    );
  }

  return (await response.json()) as Record<string, unknown>;
};

const respondSuccess = (res: functions.Response, payload: object): void => {
  res.status(200).json({ success: true, ...payload });
};

const respondBadRequest = (res: functions.Response, message: string): void => {
  res.status(400).json({ success: false, error: message });
};

const respondServerError = (res: functions.Response, error: unknown): void => {
  const message = error instanceof Error ? error.message : 'Unexpected server error';
  functions.logger.error('Spoonacular proxy failed', { error: message });
  res.status(500).json({ success: false, error: message });
};

const ensureGet = (req: functions.Request, res: functions.Response): boolean => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return false;
  }
  return true;
};

export const health = functions.region(REGION).https.onRequest((req, res) => {
  res.status(200).json({
    ok: true,
    service: 'myyummibite-functions',
    timestamp: new Date().toISOString(),
  });
});

export const ping = functions.region(REGION).https.onRequest((req, res) => {
  functions.logger.info('Ping received', { ip: req.ip, userAgent: req.get('user-agent') });
  res.status(200).send('pong');
});

export const recipesRandom = spoonacularRuntime.https.onRequest(async (req, res) => {
  if (!ensureGet(req, res)) return;

  try {
    const cuisine = parseCuisineFilters(req.query.cuisine);
    const mealParams = getMealTypeParams(req.query.mealType);
    const numberOfRecipes = parseNumberParam(req.query.number, 1, MIN_RECIPES, MAX_RANDOM_RECIPES);
    const params: Record<string, string | undefined> = {
      number: String(numberOfRecipes),
      sort: 'random',
      addRecipeNutrition: 'true',
      ...mealParams,
    };
    if (cuisine) {
      params.cuisine = cuisine;
    }

    const data = await callSpoonacular('complexSearch', params);
    const recipes = (data.results as unknown[] | undefined) ?? [];
    functions.logger.info('Random recipes fetched', { count: recipes.length });
    respondSuccess(res, { recipes });
  } catch (error) {
    respondServerError(res, error);
  }
});

export const recipesSearch = spoonacularRuntime.https.onRequest(async (req, res) => {
  if (!ensureGet(req, res)) return;

  try {
    const searchQuery = toSingleString(req.query.query);
    if (!searchQuery) {
      respondBadRequest(res, 'query parameter is required');
      return;
    }

    const cuisine = parseCuisineFilters(req.query.cuisine);
    const numberOfRecipes = parseNumberParam(req.query.number, 10, MIN_RECIPES, MAX_SEARCH_RECIPES);
    const params: Record<string, string | undefined> = {
      query: searchQuery,
      number: String(numberOfRecipes),
      addRecipeNutrition: 'true',
    };
    if (cuisine) {
      params.cuisine = cuisine;
    }

    const data = await callSpoonacular('complexSearch', params);
    const recipes = (data.results as unknown[] | undefined) ?? [];
    functions.logger.info('Recipe search completed', { query: searchQuery, count: recipes.length });
    respondSuccess(res, { recipes });
  } catch (error) {
    respondServerError(res, error);
  }
});

export const recipesInfo = spoonacularRuntime.https.onRequest(async (req, res) => {
  if (!ensureGet(req, res)) return;

  try {
    const rawId = toSingleString(req.query.recipeId);
    if (!rawId) {
      respondBadRequest(res, 'recipeId parameter is required');
      return;
    }

    const recipeId = Number(rawId);
    if (!Number.isFinite(recipeId) || recipeId <= 0) {
      respondBadRequest(res, 'recipeId must be a positive number');
      return;
    }

    const data = await callSpoonacular(`${recipeId}/information`, { includeNutrition: 'true' });
    functions.logger.info('Recipe info fetched', { recipeId, title: data.title });
    respondSuccess(res, { recipe: data });
  } catch (error) {
    respondServerError(res, error);
  }
});

const requireUid = (context: functions.https.CallableContext): string => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }
  return context.auth.uid;
};

const assertString = (value: unknown, fieldName: string): string => {
  const text = toSingleString(value)?.trim();
  if (!text) {
    throw new functions.https.HttpsError('invalid-argument', `${fieldName} is required`);
  }
  return text;
};

const assertStringArray = (value: unknown, fieldName: string): string[] => {
  if (!Array.isArray(value)) {
    throw new functions.https.HttpsError('invalid-argument', `${fieldName} must be an array`);
  }
  const normalized = value
    .map((item) => toSingleString(item)?.trim())
    .filter(Boolean) as string[];
  if (normalized.length === 0) {
    throw new functions.https.HttpsError('invalid-argument', `${fieldName} must have at least one entry`);
  }
  return normalized;
};

const parseDifficulty = (value: unknown | undefined): 'easy' | 'medium' | 'hard' | undefined => {
  const normalized = toSingleString(value)?.toLowerCase();
  if (!normalized) return undefined;
  if (normalized === 'easy' || normalized === 'medium' || normalized === 'hard') {
    return normalized;
  }
  throw new functions.https.HttpsError(
    'invalid-argument',
    'difficulty must be one of easy, medium or hard'
  );
};

const sanitizeNutrition = (value: unknown): Record<string, string> | undefined => {
  if (value == null) return undefined;
  if (typeof value !== 'object') {
    throw new functions.https.HttpsError('invalid-argument', 'nutrition must be an object');
  }
  const entries = Object.entries(value).filter(([, v]) => v !== undefined && v !== null);
  if (entries.length === 0) return undefined;
  const sanitized: Record<string, string> = {};
  entries.forEach(([key, entryValue]) => {
    const text = toSingleString(entryValue);
    if (text) {
      sanitized[key] = text;
    }
  });
  return Object.keys(sanitized).length ? sanitized : undefined;
};

interface PublishRecipeInput {
  title?: unknown;
  ingredients?: unknown;
  steps?: unknown;
  readyInMinutes?: unknown;
  difficulty?: unknown;
  nutrition?: unknown;
  imageUrl?: unknown;
}

interface PublishedRecipeActionInput {
  publishedRecipeId?: unknown;
  active?: unknown;
}

const buildRecipeDoc = (
  authorId: string,
  title: string,
  imageUrl: string,
  ingredients: string[],
  steps: string[],
  readyInMinutes: number | undefined,
  difficulty: 'easy' | 'medium' | 'hard' | undefined,
  nutrition: Record<string, string> | undefined
) => {
  const payload: Record<string, unknown> = {
    authorId,
    title,
    imageUrl,
    ingredients,
    steps,
    likesCount: 0,
    savesCount: 0,
    sharesCount: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  if (typeof readyInMinutes === 'number') {
    payload.readyInMinutes = readyInMinutes;
  }
  if (difficulty) {
    payload.difficulty = difficulty;
  }
  if (nutrition) {
    payload.nutrition = nutrition;
  }
  return payload;
};

export const publishRecipe = functions.region(REGION).https.onCall(async (data: PublishRecipeInput, context) => {
  const uid = requireUid(context);
  const title = assertString(data.title, 'title');
  const ingredients = assertStringArray(data.ingredients, 'ingredients');
  const steps = assertStringArray(data.steps, 'steps');
  const imageUrl = assertString(data.imageUrl, 'imageUrl');
  functions.logger.info('publishRecipe called', { uid, title });
  let readyInMinutes: number | undefined;
  if (data.readyInMinutes != null) {
    const parsed = Number(data.readyInMinutes);
    if (Number.isFinite(parsed)) {
      readyInMinutes = Math.trunc(Math.max(parsed, 0));
    }
  }
  const difficulty = parseDifficulty(data.difficulty);
  const nutrition = sanitizeNutrition(data.nutrition);

  const docRef = db.collection(PUBLISHED_COLLECTION).doc();
  await docRef.set(
    buildRecipeDoc(uid, title, imageUrl, ingredients, steps, readyInMinutes, difficulty, nutrition)
  );
  return { id: docRef.id, imageUrl };
});

const updateLikeOrSave = async (
  recipeId: string,
  uid: string,
  field: 'likesCount' | 'savesCount',
  collectionName: string,
  register: boolean
) => {
  const recipeRef = db.collection(PUBLISHED_COLLECTION).doc(recipeId);
  const itemRef = recipeRef.collection(collectionName).doc(uid);

  await db.runTransaction(async (tx) => {
    const itemSnapshot = await tx.get(itemRef);
    const isActive = itemSnapshot.exists;
    if (register === isActive) {
      return;
    }

    const change = register ? 1 : -1;
    if (register) {
      tx.set(itemRef, { createdAt: admin.firestore.FieldValue.serverTimestamp() });
    } else {
      tx.delete(itemRef);
    }
    tx.update(recipeRef, { [field]: admin.firestore.FieldValue.increment(change) });
  });
};

export const setPublishedRecipeLike = functions
  .region(REGION)
  .https.onCall(async (data: PublishedRecipeActionInput, context) => {
    const uid = requireUid(context);
    const recipeId = assertString(data.publishedRecipeId, 'publishedRecipeId');
    const like = Boolean(data.active);
    functions.logger.info('setPublishedRecipeLike called', { uid, recipeId, like });
    await updateLikeOrSave(recipeId, uid, 'likesCount', LIKES_SUBCOLLECTION, like);
    return { success: true };
  });

export const setPublishedRecipeSave = functions
  .region(REGION)
  .https.onCall(async (data: PublishedRecipeActionInput, context) => {
    const uid = requireUid(context);
    const recipeId = assertString(data.publishedRecipeId, 'publishedRecipeId');
    const save = Boolean(data.active);
    functions.logger.info('setPublishedRecipeSave called', { uid, recipeId, save });
    await updateLikeOrSave(recipeId, uid, 'savesCount', SAVES_SUBCOLLECTION, save);
    return { success: true };
  });

export const incrementPublishedRecipeShare = functions
  .region(REGION)
  .https.onCall(async (data: PublishedRecipeActionInput, context) => {
    requireUid(context);
    const recipeId = assertString(data.publishedRecipeId, 'publishedRecipeId');
    functions.logger.info('incrementPublishedRecipeShare called', { recipeId });
    const recipeRef = db.collection(PUBLISHED_COLLECTION).doc(recipeId);
    await recipeRef.update({ sharesCount: admin.firestore.FieldValue.increment(1) });
    return { success: true };
  });

export const deletePublishedRecipe = functions.region(REGION).https.onCall(async (data: PublishedRecipeActionInput, context) => {
  const uid = requireUid(context);
  const recipeId = assertString(data.publishedRecipeId, 'publishedRecipeId');
  functions.logger.info('deletePublishedRecipe called', { uid, recipeId });
  const recipeRef = db.collection(PUBLISHED_COLLECTION).doc(recipeId);
  const snapshot = await recipeRef.get();
  if (!snapshot.exists) {
    throw new functions.https.HttpsError('not-found', 'Recipe does not exist');
  }
  const recipeData = snapshot.data();
  if (recipeData?.authorId !== uid) {
    throw new functions.https.HttpsError('permission-denied', 'Only the author can delete the recipe');
  }
  await recipeRef.delete();
  return { success: true };
});
