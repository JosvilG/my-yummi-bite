import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
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
import type { RecipeSummary } from '../services/spoonacularService';
import {
  getPublishedRecipes,
  hasUserLikedPublishedRecipe,
  setPublishedRecipeLike,
  setPublishedRecipeSave,
  type PublishedRecipeDoc,
} from '@/features/social/services/publishedRecipeService';
import { addBreadcrumb, captureException } from '@/lib/sentry';
import { log } from '@/lib/logger';
import { useAppAlertModal } from '@/shared/hooks/useAppAlertModal';

const { width, height } = Dimensions.get('window');

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
        { backgroundColor: selected ? colors.primary : colors.background, borderColor: selected ? colors.primary : colors.border },
      ]}
      scaleValue={0.92}
    >
      <Text style={[styles.mealTypeText, { color: selected ? colors.background : colors.text }]}>
        {translatedLabel}
      </Text>
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
  const [publishedRecipes, setPublishedRecipes] = useState<PublishedRecipeDoc[]>([]);
  const [publishedLoading, setPublishedLoading] = useState(false);
  const [publishedReloadNonce, setPublishedReloadNonce] = useState(0);
  const [deckResetKey, setDeckResetKey] = useState(0);
  const [refillAttempted, setRefillAttempted] = useState(false);
  const [waitingForNewCards, setWaitingForNewCards] = useState(false);
  const [deckCards, setDeckCards] = useState<HomeCard[]>([]);
  const [deckCardIndex, setDeckCardIndex] = useState(0);
  const recipes = recipeStore.randomRecipe ?? [];

  const resetDeck = useCallback(() => {
    setDeckCards([]);
    setDeckCardIndex(0);
    setWaitingForNewCards(true);
  }, []);

  useEffect(() => {
    log.debug('HomeScreen mounted, loading recipes');
    recipeStore.loadRandomRecipe(15);
  }, [recipeStore]);

  useEffect(() => {
    let active = true;

    const loadPublished = async () => {
      setPublishedLoading(true);
      const result = await getPublishedRecipes(10);
      if (!active) return;

      if (!result.success || !result.recipes) {
        setPublishedRecipes([]);
        setPublishedLoading(false);
        return;
      }

      if (!user?.uid) {
        setPublishedRecipes(result.recipes);
        setPublishedLoading(false);
        return;
      }

      const likedResults = await Promise.all(
        result.recipes.map(async (r) => {
          const liked = await hasUserLikedPublishedRecipe(r.id, user.uid);
          return { ...r, likedByMe: liked.success ? !!liked.liked : false };
        })
      );

      if (!active) return;
      setPublishedRecipes(likedResults);
      setPublishedLoading(false);
    };

    loadPublished();
    return () => {
      active = false;
    };
  }, [user?.uid, publishedReloadNonce]);

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

  const candidateCards: HomeCard[] = useMemo(() => {
    if (user?.uid && !favoritesHydrated) return [];
    const filteredPublished = publishedRecipes.filter(r => !favoritePublishedIds.has(r.id));
    const filteredSpoonacular = recipes.filter(r => !favoriteSpoonacularIds.has(r.id));
    const merged: HomeCard[] = [];
    const maxLen = Math.max(filteredSpoonacular.length, filteredPublished.length);
    for (let i = 0; i < maxLen; i++) {
      if (filteredPublished[i]) merged.push(filteredPublished[i]);
      if (filteredSpoonacular[i]) merged.push(filteredSpoonacular[i]);
    }
    return merged;
  }, [favoritePublishedIds, favoriteSpoonacularIds, favoritesHydrated, publishedRecipes, recipes, user?.uid]);

  useEffect(() => {
    if (deckCards.length > 0) {
      if (refillAttempted) setRefillAttempted(false);
      return;
    }

    if (candidateCards.length === 0) return;
    if (waitingForNewCards && (recipeStore.loading || publishedLoading)) return;

    setDeckCards(candidateCards);
    setDeckCardIndex(0);
    setWaitingForNewCards(false);
    setDeckResetKey(k => k + 1);
  }, [candidateCards, deckCards.length, publishedLoading, recipeStore.loading, refillAttempted, waitingForNewCards]);

  useEffect(() => {
    if (deckCards.length > 0) return;
    if (candidateCards.length > 0) return;
    if (user?.uid && !favoritesHydrated) return;
    if (recipeStore.loading || publishedLoading) return;
    if (refillAttempted) return;

    setRefillAttempted(true);
    setWaitingForNewCards(true);
    recipeStore.loadRandomRecipe(15);
    setPublishedReloadNonce(n => n + 1);
  }, [candidateCards.length, deckCards.length, publishedLoading, recipeStore, recipeStore.loading, refillAttempted]);

  const handleSelectMealType = (mealType: string) => {
    log.debug('Meal type filter changed', { mealType, previousType: selectedMealType });
    
    if (selectedMealType === mealType) {
      setSelectedMealType(null);
      recipeStore.setMealType(null);
    } else {
      setSelectedMealType(mealType);
      recipeStore.setMealType(mealType);
    }
    resetDeck();
    recipeStore.loadRandomRecipe(15);
  };

  const handleSwipedLeft = useCallback(() => {
  }, []);

  const handleSwipedRight = useCallback(async (cardIndex: number) => {
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
    }
  }, [deckCards, user?.uid]);

  const handleSwipedAll = useCallback(() => {
    log.info('All recipes swiped, loading more');
    resetDeck();
    recipeStore.loadRandomRecipe(15);
    setPublishedReloadNonce(n => n + 1);
  }, [recipeStore, resetDeck]);

  const handleSkipRecipe = useCallback(() => {
    swiperRef.current?.swipeLeft();
  }, []);

  const handleSaveRecipe = useCallback(() => {
    swiperRef.current?.swipeRight();
  }, []);

  const handleTogglePublishedLike = useCallback(async (publishedId: string, liked: boolean) => {
    if (!user?.uid) {
      showInfo({ title: t('common.error'), message: t('errors.loginRequiredToLike'), confirmText: t('common.close') });
      return;
    }

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

    setPublishedRecipes(current =>
      current.map(r =>
        r.id === publishedId
          ? {
              ...r,
              likedByMe: !liked,
              likesCount: Math.max(0, (r.likesCount ?? 0) + (liked ? -1 : 1)),
            }
          : r
      )
    );

    const result = await setPublishedRecipeLike(publishedId, user.uid, !liked);
    if (result.success) return;

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

    setPublishedRecipes(current =>
      current.map(r =>
        r.id === publishedId
          ? {
              ...r,
              likedByMe: liked,
              likesCount: Math.max(0, (r.likesCount ?? 0) + (liked ? 1 : -1)),
            }
          : r
      )
    );
    showInfo({
      title: t('common.error'),
      message: result.error ?? t('errors.likeUpdateFailed'),
      confirmText: t('common.close'),
    });
  }, [showInfo, t, user?.uid]);

  const renderCard = useCallback((recipe: HomeCard) => {
    return (
      <RecipeCard 
        recipe={recipe} 
        onSkip={handleSkipRecipe}
        onSave={handleSaveRecipe}
        onTogglePublishedLike={handleTogglePublishedLike}
      />
    );
  }, [handleSkipRecipe, handleSaveRecipe, handleTogglePublishedLike]);

  const deckPreparing = deckCards.length === 0 && candidateCards.length > 0;
  const isLoading =
    deckPreparing ||
    (user?.uid ? !favoritesHydrated : false) ||
    (recipeStore.loading && recipes.length === 0) ||
    (publishedLoading && publishedRecipes.length === 0);
  const showEmptyState = !isLoading && candidateCards.length === 0 && deckCards.length === 0 && refillAttempted;
  const showDeck = deckCards.length > 0;
  const showLoaderFallback = !showEmptyState && !showDeck;
  const shouldShowLoader = isLoading || showLoaderFallback;

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="heart-outline" size={64} color={colors.secondary} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('home.noMoreRecipesTitle')}</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textLight }]}>
        {t('home.noMoreRecipesSubtitle')}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.tertiary }]} edges={['top']}>
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filters}
        >
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
              resetDeck();
              recipeStore.loadRandomRecipe(15);
            }}
            scaleValue={0.92}
          >
            <Text
              style={[
                styles.mealTypeText,
                { color: !selectedMealType ? colors.background : colors.text },
              ]}
            >
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
            onSwiped={(index) => setDeckCardIndex(index + 1)}
            cardIndex={deckCardIndex}
            backgroundColor="transparent"
            stackSize={3}
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
          </View>
        )}
      {modal}
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
  loaderText: {
    marginTop: 16,
    fontFamily: FONTS.medium,
  },
  swiperContainer: {
    flex: 1,
  },
  swiper: {
    backgroundColor: 'transparent',
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
});

export default HomeScreen;
