import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecipeStore } from '@/app/providers/RecipeProvider';
import { useAuth } from '@/app/providers/AuthProvider';
import RecipeCard from '../components/RecipeCard';
import RecipeCardSkeleton from '@/shared/components/RecipeCardSkeleton';
import AnimatedPressable from '@/shared/components/AnimatedPressable';
import { saveFavoriteRecipe } from '../services/favoriteService';
import { MEAL_TYPES } from '@/constants/recipe';
import { COLORS, FONTS } from '@/constants/theme';
import type { RecipeSummary } from '../services/spoonacularService';

const { width, height } = Dimensions.get('window');

const getMealTypeTranslationKey = (mealType: string): string => {
  const key = mealType.toLowerCase().replace(/\s+/g, '');
  return `mealTypes.${key}`;
};

interface MealTypePillProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const MealTypePill: React.FC<MealTypePillProps> = ({ label, selected, onPress }) => {
  const { t } = useTranslation();
  const translatedLabel = t(getMealTypeTranslationKey(label), { defaultValue: label });
  
  return (
    <AnimatedPressable
      onPress={onPress}
      style={[styles.mealTypeChip, selected && styles.mealTypeChipSelected]}
      scaleValue={0.92}
    >
      <Text style={[styles.mealTypeText, selected && styles.mealTypeTextSelected]}>
        {translatedLabel}
      </Text>
    </AnimatedPressable>
  );
};

const HomeScreen: React.FC = observer(() => {
  const { t } = useTranslation();
  const recipeStore = useRecipeStore();
  const { user } = useAuth();
  const swiperRef = useRef<Swiper<RecipeSummary>>(null);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
  const recipes = recipeStore.randomRecipe ?? [];

  useEffect(() => {
    recipeStore.loadRandomRecipe(15);
  }, [recipeStore]);

  const handleSelectMealType = (mealType: string) => {
    if (selectedMealType === mealType) {
      setSelectedMealType(null);
      recipeStore.setMealType(null);
    } else {
      setSelectedMealType(mealType);
      recipeStore.setMealType(mealType);
    }
    recipeStore.loadRandomRecipe(15);
  };

  const handleSwipedLeft = useCallback(() => {
  }, []);

  const handleSwipedRight = useCallback(async (cardIndex: number) => {
    const recipe = recipes[cardIndex];
    if (!user?.uid || !recipe) return;
    await saveFavoriteRecipe(user.uid, recipe.id, recipe.image ?? '', recipe.cuisines);
  }, [recipes, user?.uid]);

  const handleSwipedAll = useCallback(() => {
    recipeStore.loadRandomRecipe(15);
  }, [recipeStore]);

  const handleSkipRecipe = useCallback(() => {
    swiperRef.current?.swipeLeft();
  }, []);

  const handleSaveRecipe = useCallback(() => {
    swiperRef.current?.swipeRight();
  }, []);

  const renderCard = useCallback((recipe: RecipeSummary) => {
    return (
      <RecipeCard 
        recipe={recipe} 
        onSkip={handleSkipRecipe}
        onSave={handleSaveRecipe}
      />
    );
  }, [handleSkipRecipe, handleSaveRecipe]);

  const isLoading = recipeStore.loading || recipes.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filters}
        >
          <AnimatedPressable
            style={[
              styles.mealTypeChip,
              !selectedMealType && styles.mealTypeChipSelected,
            ]}
            onPress={() => {
              setSelectedMealType(null);
              recipeStore.setMealType(null);
              recipeStore.loadRandomRecipe(15);
            }}
            scaleValue={0.92}
          >
            <Text
              style={[
                styles.mealTypeText,
                !selectedMealType && styles.mealTypeTextSelected,
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
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.tertiary,
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
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mealTypeChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  mealTypeText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.text,
  },
  mealTypeTextSelected: {
    color: COLORS.background,
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
});

export default HomeScreen;
