import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, InteractionManager, ScrollView, StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRecipeStore } from '@/app/providers/RecipeProvider';
import { useAuth } from '@/app/providers/AuthProvider';
import RecipeCard from '../components/RecipeCard';
import RecipeCardSkeleton from '@/shared/components/RecipeCardSkeleton';
import AnimatedPressable from '@/shared/components/AnimatedPressable';
import { saveFavoriteRecipe, savePublishedFavoriteRecipe } from '../services/favoriteService';
import { useFavoriteRecipes } from '../hooks/useFavoriteRecipes';
import { MEAL_TYPES } from '@/constants/recipe';
import { FONTS } from '@/constants/theme';
import { useColors } from '@/shared/hooks/useColors';
import { fetchRandomRecipes, type RecipeSummary } from '../services/spoonacularService';
import {
  getPublishedRecipesByAuthorsPage,
  getPublishedRecipesPage,
  hasUserLikedPublishedRecipe,
  setPublishedRecipeLike,
  setPublishedRecipeSave,
  type PublishedRecipeDoc,
  type PublishedRecipesPageCursor,
} from '@/features/social/services/publishedRecipeService';
import { addBreadcrumb, captureException } from '@/lib/sentry';
import { log } from '@/lib/logger';
import { useAppAlertModal } from '@/shared/hooks/useAppAlertModal';
import ReportReasonModal, { type ReportReasonKey } from '@/shared/components/ReportReasonModal';
import { reportRecipe, type ReportTarget } from '../services/reportService';
import { subscribeToFollowingUserIds } from '@/features/profile/services/followService';

const PAGE_SIZE = 10;
const BUFFER_TARGET = 18;
const BUFFER_THRESHOLD = 6;
const MAX_REFILL_STEPS = 12;
const MAX_SPOON_RETRIES = 4;

const getMealTypeTranslationKey = (mealType: string): string => {
  const key = mealType.toLowerCase().replace(/\s+/g, '');
  return `mealTypes.${key}`;
};

interface MealTypePillProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}

const MealTypePill: React.FC<MealTypePillProps> = ({ label, selected, onPress, colors }) => {
  const { t } = useTranslation();
  const translatedLabel = t(getMealTypeTranslationKey(label), { defaultValue: label });

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[
        styles.mealTypeChip,
        {
          backgroundColor: selected ? colors.primary : colors.background,
          borderColor: selected ? colors.primary : colors.border,
        },
      ]}
      scaleValue={0.92}
    >
      <Text style={[styles.mealTypeText, { color: selected ? colors.background : colors.text }]}>{translatedLabel}</Text>
    </AnimatedPressable>
  );
};

const HomeScreen: React.FC = observer(() => {
  const { t } = useTranslation();
  const recipeStore = useRecipeStore();
  const { user } = useAuth();
  const { favorites, hydrated: favoritesHydrated } = useFavoriteRecipes();
  const colors = useColors();
  const { showInfo, modal } = useAppAlertModal();

  type HomeCard = RecipeSummary | PublishedRecipeDoc;
  const isPublishedRecipe = (card: HomeCard): card is PublishedRecipeDoc => typeof card.id === 'string';

  const swiperRef = useRef<Swiper<HomeCard>>(null);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
  const [deckResetKey, setDeckResetKey] = useState(0);
  const [deckCards, setDeckCards] = useState<HomeCard[]>([]);
  const [deckCardIndex, setDeckCardIndex] = useState(0);
  const [followingUserIds, setFollowingUserIds] = useState<string[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [followedExhausted, setFollowedExhausted] = useState(false);
  const [communityExhausted, setCommunityExhausted] = useState(false);
  const [spoonExhausted, setSpoonExhausted] = useState(false);
  const [hasTriedLoad, setHasTriedLoad] = useState(false);
  const [deckEnded, setDeckEnded] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reportTarget, setReportTarget] = useState<ReportTarget | null>(null);

  const followedCursorRef = useRef<PublishedRecipesPageCursor | undefined>(undefined);
  const communityCursorRef = useRef<PublishedRecipesPageCursor | undefined>(undefined);
  const publishedSeenIdsRef = useRef<Set<string>>(new Set());
  const spoonSeenIdsRef = useRef<Set<number>>(new Set());
  const likedCacheRef = useRef<Map<string, boolean>>(new Map());
  const loadingMoreRef = useRef(false);
  const followingUserIdsRef = useRef<string[]>([]);
  const deckCardIndexRef = useRef(0);
  const deckCardsLengthRef = useRef(0);
  const isDraggingRef = useRef(false);
  
  // NUEVO: Buffer separado para acumular cards sin afectar el deck activo
  const nextCardsBufferRef = useRef<HomeCard[]>([]);
  const isRefreshingBufferRef = useRef(false);

  const followedExhaustedRef = useRef(false);
  const communityExhaustedRef = useRef(false);
  const spoonExhaustedRef = useRef(false);

  const setFollowedExhaustedSafe = useCallback((value: boolean) => {
    followedExhaustedRef.current = value;
    setFollowedExhausted(value);
  }, []);

  const setCommunityExhaustedSafe = useCallback((value: boolean) => {
    communityExhaustedRef.current = value;
    setCommunityExhausted(value);
  }, []);

  const setSpoonExhaustedSafe = useCallback((value: boolean) => {
    spoonExhaustedRef.current = value;
    setSpoonExhausted(value);
  }, []);

  const getCardImageUrl = useCallback(
    (card: HomeCard): string => {
      if (isPublishedRecipe(card)) return card.imageUrl;
      if (card.image) {
        const sizePattern = /-\d+x\d+\./;
        if (sizePattern.test(card.image)) {
          return card.image.replace(sizePattern, '-636x393.');
        }
        return card.image;
      }
      return `https://img.spoonacular.com/recipes/${card.id}-636x393.jpg`;
    },
    [isPublishedRecipe]
  );

  const resetFeed = useCallback(() => {
    setDeckCards([]);
    setDeckCardIndex(0);
    setDeckResetKey(k => k + 1);
    setHasTriedLoad(false);
    setDeckEnded(false);
    followedCursorRef.current = undefined;
    communityCursorRef.current = undefined;
    publishedSeenIdsRef.current = new Set();
    spoonSeenIdsRef.current = new Set();
    likedCacheRef.current = new Map();
    loadingMoreRef.current = false;
    setFollowedExhaustedSafe(false);
    setCommunityExhaustedSafe(false);
    setSpoonExhaustedSafe(false);
    deckCardIndexRef.current = 0;
    deckCardsLengthRef.current = 0;
    nextCardsBufferRef.current = [];
    isRefreshingBufferRef.current = false;
  }, [setCommunityExhaustedSafe, setFollowedExhaustedSafe, setSpoonExhaustedSafe]);

  useEffect(() => {
    if (!user?.uid) {
      setFollowingUserIds([]);
      return;
    }
    return subscribeToFollowingUserIds(user.uid, 10, setFollowingUserIds);
  }, [user?.uid]);

  useEffect(() => {
    followingUserIdsRef.current = followingUserIds;
    log.debug('HomeScreen: following updated', { count: followingUserIds.length });
  }, [followingUserIds]);

  useEffect(() => {
    deckCardIndexRef.current = deckCardIndex;
    deckCardsLengthRef.current = deckCards.length;
  }, [deckCardIndex, deckCards.length]);

  const favoriteSpoonacularIds = useMemo(() => {
    const set = new Set<number>();
    for (const fav of favorites) {
      if (fav.source === 'custom') continue;
      if (fav.source === 'published') continue;
      set.add(fav.id);
    }
    return set;
  }, [favorites]);

  const favoritePublishedIds = useMemo(() => {
    const set = new Set<string>();
    for (const fav of favorites) {
      if (fav.source === 'published' && fav.publishedId) set.add(fav.publishedId);
    }
    return set;
  }, [favorites]);

  const favoriteSpoonacularIdsRef = useRef<Set<number>>(new Set());
  const favoritePublishedIdsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    favoriteSpoonacularIdsRef.current = favoriteSpoonacularIds;
    favoritePublishedIdsRef.current = favoritePublishedIds;
    log.debug('HomeScreen: favorites updated', {
      spoonacular: favoriteSpoonacularIds.size,
      published: favoritePublishedIds.size,
    });
  }, [favoritePublishedIds, favoriteSpoonacularIds]);

  const decoratePublishedRecipes = useCallback(
    async (recipes: PublishedRecipeDoc[]): Promise<PublishedRecipeDoc[]> => {
      if (!user?.uid) return recipes;

      const results = await Promise.all(
        recipes.map(async (recipe) => {
          const cached = likedCacheRef.current.get(recipe.id);
          if (typeof cached === 'boolean') return { ...recipe, likedByMe: cached };

          const liked = await hasUserLikedPublishedRecipe(recipe.id, user.uid);
          const value = liked.success ? !!liked.liked : false;
          likedCacheRef.current.set(recipe.id, value);
          return { ...recipe, likedByMe: value };
        })
      );

      return results;
    },
    [user?.uid]
  );

  const loadNextPublishedPage = useCallback(async (): Promise<HomeCard[]> => {
    const followingSet = new Set(followingUserIdsRef.current);

    if (!followedExhaustedRef.current) {
      log.debug('HomeScreen: fetching followed published recipes', {
        authors: followingUserIdsRef.current.length,
        hasCursor: !!followedCursorRef.current,
      });
      const authorIds = followingUserIdsRef.current.slice(0, 10);
      if (authorIds.length === 0) {
        setFollowedExhaustedSafe(true);
        return [];
      }

      const res = await getPublishedRecipesByAuthorsPage(authorIds, PAGE_SIZE, followedCursorRef.current);
      if (!res.success) {
        setFollowedExhaustedSafe(true);
        captureException(new Error(res.error ?? 'getPublishedRecipesByAuthorsPage failed'), {
          operation: 'HomeScreen.loadNextPublishedPage.followed',
          userId: user?.uid,
        });
        return [];
      }

      followedCursorRef.current = res.cursor;
      const raw = res.recipes ?? [];
      if (raw.length === 0) {
        setFollowedExhaustedSafe(true);
        return [];
      }

      const filtered = raw.filter(
        r => !favoritePublishedIdsRef.current.has(r.id) && !publishedSeenIdsRef.current.has(r.id)
      );
      if (filtered.length === 0) {
        log.debug('HomeScreen: followed page fully filtered', {
          raw: raw.length,
          favorites: favoritePublishedIdsRef.current.size,
          seen: publishedSeenIdsRef.current.size,
        });
      } else {
        log.debug('HomeScreen: followed page accepted', { raw: raw.length, filtered: filtered.length });
      }
      filtered.forEach(r => publishedSeenIdsRef.current.add(r.id));
      return decoratePublishedRecipes(filtered);
    }

    if (!communityExhaustedRef.current) {
      log.debug('HomeScreen: fetching community published recipes', { hasCursor: !!communityCursorRef.current });
      const res = await getPublishedRecipesPage(PAGE_SIZE, communityCursorRef.current);
      if (!res.success) {
        setCommunityExhaustedSafe(true);
        captureException(new Error(res.error ?? 'getPublishedRecipesPage failed'), {
          operation: 'HomeScreen.loadNextPublishedPage.community',
          userId: user?.uid,
        });
        return [];
      }

      communityCursorRef.current = res.cursor;
      const raw = res.recipes ?? [];
      if (raw.length === 0) {
        setCommunityExhaustedSafe(true);
        return [];
      }

      const filtered = raw.filter(r => {
        if (favoritePublishedIdsRef.current.has(r.id)) return false;
        if (publishedSeenIdsRef.current.has(r.id)) return false;
        if (followingSet.has(r.authorId)) return false;
        return true;
      });
      if (filtered.length === 0) {
        log.debug('HomeScreen: community page fully filtered', {
          raw: raw.length,
          favorites: favoritePublishedIdsRef.current.size,
          seen: publishedSeenIdsRef.current.size,
          following: followingSet.size,
        });
      } else {
        log.debug('HomeScreen: community page accepted', { raw: raw.length, filtered: filtered.length });
      }
      filtered.forEach(r => publishedSeenIdsRef.current.add(r.id));
      return decoratePublishedRecipes(filtered);
    }

    return [];
  }, [decoratePublishedRecipes, setCommunityExhaustedSafe, setFollowedExhaustedSafe, user?.uid]);

  const loadNextSpoonBatch = useCallback(async (): Promise<RecipeSummary[]> => {
    log.debug('HomeScreen: fetching spoonacular recipes', {
      count: PAGE_SIZE,
      filters: recipeStore.filters.length,
      mealType: recipeStore.mealType ?? null,
    });
    const result = await fetchRandomRecipes(recipeStore.filters, PAGE_SIZE, recipeStore.mealType);
    if (!result.success) {
      setSpoonExhaustedSafe(true);
      captureException(new Error(result.error ?? 'fetchRandomRecipes failed'), {
        operation: 'HomeScreen.loadNextSpoonBatch',
        userId: user?.uid,
      });
      return [];
    }
    const raw = result.recipes ?? [];
    if (raw.length === 0) {
      setSpoonExhaustedSafe(true);
      return [];
    }
    log.debug('HomeScreen: spoonacular fetched', { raw: raw.length });
    return raw;
  }, [recipeStore.filters, recipeStore.mealType, setSpoonExhaustedSafe, user?.uid]);

  // NUEVO: Función para refrescar el buffer en background
  const refreshBufferInBackground = useCallback(async () => {
    if (isRefreshingBufferRef.current) return;
    if (user?.uid && !favoritesHydrated) return;

    isRefreshingBufferRef.current = true;
    log.debug('HomeScreen: refreshing buffer in background');

    try {
      const newCards: HomeCard[] = [];
      let steps = 0;

      while (newCards.length < BUFFER_TARGET && steps < MAX_REFILL_STEPS) {
        steps += 1;

        if (!followedExhaustedRef.current || !communityExhaustedRef.current) {
          const page = await loadNextPublishedPage();
          if (page.length > 0) {
            newCards.push(...page);
            continue;
          }
          if (!followedExhaustedRef.current || !communityExhaustedRef.current) {
            continue;
          }
        }

        if (followedExhaustedRef.current && communityExhaustedRef.current && !spoonExhaustedRef.current) {
          let gotNew = false;

          for (let attempt = 0; attempt < MAX_SPOON_RETRIES && newCards.length < BUFFER_TARGET; attempt += 1) {
            const batch = await loadNextSpoonBatch();
            if (batch.length === 0) break;

            const filtered = batch.filter(
              r => !favoriteSpoonacularIdsRef.current.has(r.id) && !spoonSeenIdsRef.current.has(r.id)
            );
            filtered.forEach(r => spoonSeenIdsRef.current.add(r.id));
            if (filtered.length > 0) {
              newCards.push(...filtered);
              gotNew = true;
              break;
            }
          }

          if (gotNew) continue;
          setSpoonExhaustedSafe(true);
        }

        break;
      }

      nextCardsBufferRef.current = newCards;
      log.debug('HomeScreen: buffer refreshed', { cards: newCards.length });
    } catch (error) {
      captureException(error as Error, { operation: 'HomeScreen.refreshBufferInBackground', userId: user?.uid });
      log.error('HomeScreen: refresh buffer failed', error as Error);
    } finally {
      isRefreshingBufferRef.current = false;
    }
  }, [favoritesHydrated, loadNextPublishedPage, loadNextSpoonBatch, setSpoonExhaustedSafe, user?.uid]);

  // MODIFICADO: ensureBuffer ahora usa el buffer separado
  const ensureBuffer = useCallback(
    async (force = false): Promise<number> => {
      if (loadingMoreRef.current) return 0;
      if (user?.uid && !favoritesHydrated) return 0;

      const remaining = deckCardsLengthRef.current - deckCardIndexRef.current;
      
      // Solo añadimos cards cuando NO estamos arrastrando
      if (isDraggingRef.current && !force) {
        // Pero refrescamos el buffer en background si hace falta
        if (nextCardsBufferRef.current.length === 0 && !isRefreshingBufferRef.current) {
          refreshBufferInBackground();
        }
        return 0;
      }

      if (!force && remaining > BUFFER_THRESHOLD) return 0;

      loadingMoreRef.current = true;
      setLoadingMore(true);

      try {
        let cardsToAdd: HomeCard[] = [];

        // Primero intentamos usar las cards del buffer
        if (nextCardsBufferRef.current.length > 0) {
          const needed = BUFFER_TARGET - remaining;
          cardsToAdd = nextCardsBufferRef.current.splice(0, needed);
          log.debug('HomeScreen: using buffered cards', { count: cardsToAdd.length });
          
          // Si usamos cards del buffer, empezamos a refrescar para la próxima vez
          if (nextCardsBufferRef.current.length < BUFFER_TARGET / 2) {
            refreshBufferInBackground();
          }
        } else {
          // Si no hay buffer, cargamos directamente (caso inicial o force)
          const added: HomeCard[] = [];
          let steps = 0;
          const toFill = Math.max(0, BUFFER_TARGET - remaining);

          while (added.length < toFill && steps < MAX_REFILL_STEPS) {
            steps += 1;

            if (!followedExhaustedRef.current || !communityExhaustedRef.current) {
              const page = await loadNextPublishedPage();
              if (page.length > 0) {
                added.push(...page);
                continue;
              }
              if (!followedExhaustedRef.current || !communityExhaustedRef.current) {
                continue;
              }
            }

            if (followedExhaustedRef.current && communityExhaustedRef.current && !spoonExhaustedRef.current) {
              let gotNew = false;

              for (let attempt = 0; attempt < MAX_SPOON_RETRIES && added.length < toFill; attempt += 1) {
                const batch = await loadNextSpoonBatch();
                if (batch.length === 0) break;

                const filtered = batch.filter(
                  r => !favoriteSpoonacularIdsRef.current.has(r.id) && !spoonSeenIdsRef.current.has(r.id)
                );
                filtered.forEach(r => spoonSeenIdsRef.current.add(r.id));
                if (filtered.length > 0) {
                  added.push(...filtered);
                  gotNew = true;
                  break;
                }
              }

              if (gotNew) continue;
              setSpoonExhaustedSafe(true);
            }

            break;
          }

          cardsToAdd = added;
        }

        if (cardsToAdd.length > 0) {
          setDeckCards(current => [...current, ...cardsToAdd]);
          log.debug('HomeScreen: cards added to deck', { count: cardsToAdd.length });
        }

        return cardsToAdd.length;
      } catch (error) {
        captureException(error as Error, { operation: 'HomeScreen.ensureBuffer', userId: user?.uid });
        log.error('HomeScreen: ensureBuffer failed', error as Error);
        return 0;
      } finally {
        loadingMoreRef.current = false;
        setLoadingMore(false);
        setHasTriedLoad(true);
      }
    },
    [
      favoritesHydrated,
      loadNextPublishedPage,
      loadNextSpoonBatch,
      refreshBufferInBackground,
      setSpoonExhaustedSafe,
      user?.uid,
    ]
  );

  const reloadFeed = useCallback(() => {
    if (user?.uid && !favoritesHydrated) return;
    setDeckEnded(false);
    setFeedLoading(true);
    log.info('HomeScreen: reload feed', {
      mealType: recipeStore.mealType ?? null,
      filters: recipeStore.filters.length,
      following: followingUserIdsRef.current.length,
      favoritesSpoonacular: favoriteSpoonacularIdsRef.current.size,
      favoritesPublished: favoritePublishedIdsRef.current.size,
      userId: user?.uid ?? null,
    });
    resetFeed();
    ensureBuffer(true).finally(() => setFeedLoading(false));
  }, [ensureBuffer, favoritesHydrated, resetFeed, recipeStore.filters.length, recipeStore.mealType, user?.uid]);

  useEffect(() => {
    reloadFeed();
  }, [reloadFeed]);

  useEffect(() => {
    const remaining = deckCards.length - deckCardIndex;
    if (remaining <= BUFFER_THRESHOLD && !isDraggingRef.current) {
      log.debug('HomeScreen: low buffer, fetching more', { remaining, threshold: BUFFER_THRESHOLD });
      ensureBuffer(false);
    }
  }, [deckCardIndex, deckCards.length, ensureBuffer]);

  useEffect(() => {
    if (deckCards.length === 0) return;
    const next = deckCards.slice(deckCardIndex, deckCardIndex + 4);
    next.forEach((card) => {
      const uri = getCardImageUrl(card);
      if (uri && uri.startsWith('http')) {
        Image.prefetch(uri).catch(() => undefined);
      }
    });
  }, [deckCardIndex, deckCards, getCardImageUrl]);

  const handleReportPress = useCallback(
    (card: HomeCard) => {
      const target: ReportTarget = isPublishedRecipe(card)
        ? { type: 'published', id: card.id, title: card.title }
        : { type: 'spoonacular', id: card.id, title: card.title };
      setReportTarget(target);
      setReportVisible(true);
    },
    [isPublishedRecipe]
  );

  const handleReportSubmit = useCallback(
    async (reason: ReportReasonKey) => {
      if (!user?.uid) {
        showInfo({
          title: t('common.error'),
          message: t('errors.loginRequiredToReport'),
          confirmText: t('common.close'),
        });
        return;
      }
      if (!reportTarget) return;

      setReporting(true);
      const result = await reportRecipe(user.uid, reportTarget, reason);
      setReporting(false);
      setReportVisible(false);
      setReportTarget(null);

      if (!result.success) {
        showInfo({
          title: t('common.error'),
          message: result.error ?? t('common.unknownError'),
          confirmText: t('common.close'),
        });
        return;
      }

      showInfo({
        title: t('report.successTitle'),
        message: t('report.successMessage'),
        confirmText: t('common.close'),
      });
    },
    [reportTarget, showInfo, t, user?.uid]
  );

  const handleSelectMealType = (mealType: string) => {
    log.debug('Meal type filter changed', { mealType, previousType: selectedMealType });

    if (selectedMealType === mealType) {
      setSelectedMealType(null);
      recipeStore.setMealType(null);
    } else {
      setSelectedMealType(mealType);
      recipeStore.setMealType(mealType);
    }
    reloadFeed();
  };

  const handleSwipedLeft = useCallback(() => {}, []);

  const handleSwipedRight = useCallback(
    async (cardIndex: number) => {
      const card = deckCards[cardIndex];
      if (!user?.uid || !card) return;

      try {
        addBreadcrumb({
          message: 'User saved recipe as favorite',
          category: 'recipe',
          data: {
            recipeId: card.id,
            recipeName: card.title,
          },
        });
        log.info('HomeScreen: save favorite', {
          source: isPublishedRecipe(card) ? 'published' : 'spoonacular',
          id: card.id,
          title: card.title,
          userId: user.uid,
        });

        if (isPublishedRecipe(card)) {
          await savePublishedFavoriteRecipe(user.uid, {
            publishedId: card.id,
            title: card.title,
            imageUrl: card.imageUrl,
            ingredients: card.ingredients,
            steps: card.steps,
            readyInMinutes: card.readyInMinutes,
            difficulty: card.difficulty,
          });
          await setPublishedRecipeSave(card.id, user.uid, true);
        } else {
          await saveFavoriteRecipe(user.uid, card.id, card.image ?? '', card.cuisines);
        }
      } catch (error) {
        captureException(error as Error, {
          operation: 'handleSwipedRight',
          recipeId: card.id,
          userId: user.uid,
        });
        log.error('HomeScreen: save favorite failed', error as Error, { userId: user.uid, recipeId: card.id });
      }
    },
    [deckCards, isPublishedRecipe, user?.uid]
  );

  const handleSwipedAll = useCallback(() => {
    log.info('All recipes swiped, checking for more');
    isDraggingRef.current = false;
    
    // Verificamos si hay cards en el buffer o podemos cargar más
    const hasBufferedCards = nextCardsBufferRef.current.length > 0;
    const canLoadMore = !followedExhaustedRef.current || !communityExhaustedRef.current || !spoonExhaustedRef.current;
    
    if (hasBufferedCards || canLoadMore) {
      ensureBuffer(true).then((appended) => {
        if (appended > 0) {
          setDeckEnded(false);
          // NUEVO: Pequeño delay antes de resetear para evitar el flicker
          setTimeout(() => {
            setDeckResetKey(k => k + 1);
          }, 100);
          log.info('HomeScreen: appended after swipedAll', { appended });
        } else {
          setDeckEnded(true);
          log.info('HomeScreen: deck ended');
        }
      });
    } else {
      setDeckEnded(true);
      log.info('HomeScreen: deck ended - all sources exhausted');
    }
  }, [ensureBuffer]);

  const handleSwiped = useCallback((index: number) => {
    isDraggingRef.current = false;
    setDeckCardIndex(index + 1);
  }, []);

  const handleSwipedAborted = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const handleSwiping = useCallback((_x: number, _y: number) => {
    isDraggingRef.current = true;
  }, []);

  const handleSkipRecipe = useCallback(() => {
    swiperRef.current?.swipeLeft();
  }, []);

  const handleSaveRecipe = useCallback(() => {
    swiperRef.current?.swipeRight();
  }, []);

  const handleTogglePublishedLike = useCallback(
    async (publishedId: string, liked: boolean) => {
      if (!user?.uid) {
        showInfo({
          title: t('common.error'),
          message: t('errors.loginRequiredToLike'),
          confirmText: t('common.close'),
        });
        return;
      }

      likedCacheRef.current.set(publishedId, !liked);
      setDeckCards(current =>
        current.map(card =>
          isPublishedRecipe(card) && card.id === publishedId
            ? {
                ...card,
                likedByMe: !liked,
                likesCount: Math.max(0, (card.likesCount ?? 0) + (liked ? -1 : 1)),
              }
            : card
        )
      );

      const result = await setPublishedRecipeLike(publishedId, user.uid, !liked);
      if (result.success) return;

      likedCacheRef.current.set(publishedId, liked);
      setDeckCards(current =>
        current.map(card =>
          isPublishedRecipe(card) && card.id === publishedId
            ? {
                ...card,
                likedByMe: liked,
                likesCount: Math.max(0, (card.likesCount ?? 0) + (liked ? 1 : -1)),
              }
            : card
        )
      );

      showInfo({
        title: t('common.error'),
        message: result.error ?? t('errors.likeUpdateFailed'),
        confirmText: t('common.close'),
      });
    },
    [isPublishedRecipe, showInfo, t, user?.uid]
  );

  const renderCard = useCallback(
    (recipe: HomeCard) => {
      return (
        <RecipeCard
          recipe={recipe}
          onSkip={handleSkipRecipe}
          onSave={handleSaveRecipe}
          onTogglePublishedLike={handleTogglePublishedLike}
          onReportPress={handleReportPress}
        />
      );
    },
    [handleReportPress, handleSaveRecipe, handleSkipRecipe, handleTogglePublishedLike]
  );

  const isInitialLoading = feedLoading || (user?.uid ? !favoritesHydrated : false);
  const shouldShowLoader = deckCards.length === 0 && (isInitialLoading || loadingMore);
  const showDeck = deckCards.length > 0 && !deckEnded;
  const showEmptyState = !shouldShowLoader && deckEnded && hasTriedLoad;

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="heart-outline" size={64} color={colors.secondary} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('home.noMoreRecipesTitle')}</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textLight }]}>{t('home.noMoreRecipesSubtitle')}</Text>
      <AnimatedPressable
        onPress={reloadFeed}
        disabled={feedLoading || loadingMore}
        style={styles.refreshButtonWrapper}
        pressableStyle={[
          styles.refreshButton,
          { backgroundColor: colors.primary, opacity: feedLoading || loadingMore ? 0.6 : 1 },
        ]}
        scaleValue={0.96}
      >
        <View style={styles.refreshButtonContent}>
          <Ionicons name="refresh" size={18} color={colors.background} />
          <Text style={[styles.refreshButtonText, { color: colors.background }]}>{t('home.refresh')}</Text>
        </View>
      </AnimatedPressable>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.tertiary }]} edges={['top']}>
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <AnimatedPressable
            style={[
              styles.mealTypeChip,
              {
                backgroundColor: !selectedMealType ? colors.primary : colors.background,
                borderColor: !selectedMealType ? colors.primary : colors.border,
              },
            ]}
            onPress={() => {
              setSelectedMealType(null);
              recipeStore.setMealType(null);
              reloadFeed();
            }}
            scaleValue={0.92}
          >
            <Text style={[styles.mealTypeText, { color: !selectedMealType ? colors.background : colors.text }]}>
              {t('favorites.all')}
            </Text>
          </AnimatedPressable>
          {MEAL_TYPES.map(mealType => (
            <MealTypePill
              key={mealType}
              label={mealType}
              selected={selectedMealType === mealType}
              onPress={() => handleSelectMealType(mealType)}
              colors={colors}
            />
          ))}
        </ScrollView>
      </View>

      {shouldShowLoader ? (
        <View style={styles.loader}>
          <RecipeCardSkeleton />
        </View>
      ) : showEmptyState ? (
        renderEmptyState()
      ) : (
        <View style={styles.swiperContainer}>
          <Swiper
            key={`deck-${deckResetKey}`}
            ref={swiperRef}
            cards={deckCards}
            renderCard={renderCard}
            onSwipedLeft={handleSwipedLeft}
            onSwipedRight={handleSwipedRight}
            onSwipedAll={handleSwipedAll}
            onSwiped={handleSwiped}
            onSwipedAborted={handleSwipedAborted}
            onSwiping={handleSwiping}
            backgroundColor="transparent"
            stackSize={1}
            stackScale={8}
            stackSeparation={14}
            animateCardOpacity
            animateOverlayLabelsOpacity
            disableTopSwipe
            disableBottomSwipe
            cardVerticalMargin={0}
            cardHorizontalMargin={20}
            marginTop={0}
            overlayLabels={{
              left: {
                title: t('home.skip'),
                style: {
                  label: {
                    backgroundColor: colors.error,
                    color: colors.background,
                    fontSize: 24,
                    fontFamily: FONTS.bold,
                    borderRadius: 100,
                    padding: 10,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    marginTop: 20,
                    paddingRight: 20,
                  },
                },
              },
              right: {
                title: t('home.save'),
                style: {
                  label: {
                    backgroundColor: colors.success,
                    color: colors.background,
                    fontSize: 24,
                    fontFamily: FONTS.bold,
                    borderRadius: 100,
                    padding: 10,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: 20,
                    marginLeft: 20,
                  },
                },
              },
            }}
            containerStyle={styles.swiper}
          />
          {loadingMore && deckCardIndex >= deckCards.length ? (
            <View style={styles.endLoadingOverlay} pointerEvents="none">
              <RecipeCardSkeleton />
            </View>
          ) : null}
        </View>
      )}
      {modal}
      <ReportReasonModal
        visible={reportVisible}
        onClose={() => {
          setReportVisible(false);
          setReportTarget(null);
        }}
        onSubmit={handleReportSubmit}
        submitting={reporting}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    paddingTop: 40,
    paddingBottom: 16,
  },
  filters: {
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 8,
  },
  mealTypeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  mealTypeText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swiperContainer: {
    flex: 1,
  },
  swiper: {
    backgroundColor: 'transparent',
  },
  endLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    lineHeight: 20,
  },
  refreshButtonWrapper: {
    marginTop: 18,
  },
  refreshButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
  },
  refreshButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  refreshButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
});

export default HomeScreen;
