import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useRecipeStore } from '@/app/providers/RecipeProvider';
import { useAuth } from '@/app/providers/AuthProvider';
import FilterPill from '../components/FilterPill';
import RecipeCard from '../components/RecipeCard';
import VerifyButton from '../components/VerifyButton';
import RecipeCardSkeleton from '@/shared/components/RecipeCardSkeleton';
import HomeBackground from '@/shared/icons/HomeBackground';
import { saveFavoriteRecipe } from '../services/favoriteService';
import { CUISINES } from '@/constants/recipe';
import { COLORS, FONTS } from '@/constants/theme';
import type { RecipeSummary } from '../services/spoonacularService';

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC = observer(() => {
  const { t } = useTranslation();
  const recipeStore = useRecipeStore();
  const { user } = useAuth();
  const swiperRef = useRef<Swiper<RecipeSummary>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const recipes = recipeStore.randomRecipe ?? [];

  useEffect(() => {
    recipeStore.loadRandomRecipe(5);
  }, [recipeStore]);

  const handleToggleFilter = (cuisine: string) => {
    if (recipeStore.filters.includes(cuisine)) {
      recipeStore.removeFilter(cuisine);
    } else {
      recipeStore.addFilter(cuisine);
    }
    recipeStore.loadRandomRecipe(5);
    setCurrentIndex(0);
  };

  const handleSwiped = (cardIndex: number) => {
    setCurrentIndex(cardIndex + 1);
  };

  const handleSwipedLeft = (cardIndex: number) => {
    handleSwiped(cardIndex);
  };

  const handleSwipedRight = async (cardIndex: number) => {
    const recipe = recipes[cardIndex];
    if (!user?.uid || !recipe) return;
    await saveFavoriteRecipe(user.uid, recipe.id, recipe.image ?? '');
    handleSwiped(cardIndex);
  };

  const handleSwipedAll = () => {
    recipeStore.loadRandomRecipe(5);
    setCurrentIndex(0);
  };

  const handleSkipRecipe = () => {
    swiperRef.current?.swipeLeft();
  };

  const handleSaveRecipe = () => {
    swiperRef.current?.swipeRight();
  };

  const renderCard = (recipe: RecipeSummary, index: number) => {
    return <RecipeCard recipe={recipe} isActive={index === currentIndex} />;
  };

  const isLoading = recipeStore.loading || recipes.length === 0;

  return (
    <View style={styles.container}>
      <HomeBackground style={styles.background} />
      <View style={styles.content}>
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
            {CUISINES.map(cuisine => (
              <FilterPill
                key={cuisine}
                label={cuisine}
                selected={recipeStore.filters.includes(cuisine)}
                onToggle={handleToggleFilter}
              />
            ))}
          </ScrollView>
        </View>

        {isLoading ? (
          <View style={styles.loader}>
            <RecipeCardSkeleton />
            <Text style={styles.loaderText}>{t('home.discovering')}</Text>
          </View>
        ) : (
          <View style={styles.swiperContainer}>
            <Swiper
              ref={swiperRef}
              cards={recipes}
              renderCard={renderCard}
              onSwipedLeft={handleSwipedLeft}
              onSwipedRight={handleSwipedRight}
              onSwipedAll={handleSwipedAll}
              cardIndex={0}
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
                      backgroundColor: COLORS.error,
                      color: COLORS.background,
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
                      backgroundColor: COLORS.success,
                      color: COLORS.background,
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
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  background: {
    position: 'absolute',
    top: width * 0.5,
  },
  content: {
    flex: 1,
    paddingTop: 40,
  },
  filtersContainer: {
    height: 50,
  },
  filters: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    marginTop: 16,
    fontFamily: FONTS.medium,
    color: COLORS.textLight,
  },
  swiperContainer: {
    flex: 1,
  },
  swiper: {
    backgroundColor: 'transparent',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 10,
    paddingHorizontal: 32,
  },
});

export default HomeScreen;
