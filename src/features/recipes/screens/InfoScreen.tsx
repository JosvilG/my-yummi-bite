import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ReturnHeaderButton from '@/shared/components/ReturnHeaderButton';
import RecipeDetailSkeleton from '@/shared/components/RecipeDetailSkeleton';
import InfoDetalladaBG from '@/shared/icons/infoDetalladaBG';
import Ingredients from '../components/detail/Ingredients';
import Directions from '../components/detail/Directions';
import InfoTags from '../components/detail/InfoTags';
import InfoTag from '../components/InfoTag';
import { fetchRecipeInfo, type RecipeSummary } from '../services/spoonacularService';
import { useAuth } from '@/app/providers/AuthProvider';
import { useUserCategories } from '../hooks/useUserCategories';
import { assignRecipeCategory } from '../services/categoryService';
import { FONTS } from '@/constants/theme';
import { useColors } from '@/shared/hooks/useColors';
import type { MainStackParamList } from '@/types/navigation';

const BANNER_HEIGHT = 340;

const getHeroImageStyle = (scrollY: Animated.Value) => ({
  height: BANNER_HEIGHT,
  width: Dimensions.get('window').width * 2,
  transform: [
    {
      translateY: scrollY.interpolate({
        inputRange: [-BANNER_HEIGHT, 0, BANNER_HEIGHT],
        outputRange: [-BANNER_HEIGHT / 2, 0, BANNER_HEIGHT * 0.75],
      }),
    },
    {
      scale: scrollY.interpolate({
        inputRange: [-BANNER_HEIGHT, 0, BANNER_HEIGHT],
        outputRange: [2, 1, 0.6],
      }),
    },
  ],
});

export type InfoScreenProps = NativeStackScreenProps<MainStackParamList, 'Info'>;

const InfoScreen: React.FC<InfoScreenProps> = ({ route, navigation }: InfoScreenProps) => {
  const { t } = useTranslation();
  const { id, rId } = route.params || {};
  const { user } = useAuth();
  const { categories } = useUserCategories(user?.uid);
  const colors = useColors();
  const [recipe, setRecipe] = useState<RecipeSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!id) return;

    const loadRecipe = async () => {
      setLoading(true);
      const result = await fetchRecipeInfo(id);
      if (result.success && result.recipe) {
        setRecipe(result.recipe);
        setError(null);
      } else {
        setError(result.error ?? 'Unknown error');
      }
      setLoading(false);
    };

    loadRecipe();
  }, [id]);

  const handleAssignCategory = async (option: { key: string; label: string }) => {
    if (!user?.uid || !rId) return;
    await assignRecipeCategory(user.uid, rId, option.label);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ReturnHeaderButton style={styles.returnButton} onPress={() => navigation.goBack()} />
        <RecipeDetailSkeleton />
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={[styles.loader, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>{error || t('home.recipeNotFound')}</Text>
      </View>
    );
  }

  const selectorOptions = categories.map(category => ({
    key: category.id,
    label: category.category,
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ReturnHeaderButton style={styles.returnButton} onPress={() => navigation.goBack()} />
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
      >
        <View style={styles.heroContainer}>
          <Animated.Image source={{ uri: recipe.image }} style={getHeroImageStyle(scrollY)} />
        </View>

        <View style={styles.content}>
          <View style={styles.tags}>
            <InfoTag>{`${recipe.readyInMinutes ?? 0} ${t('home.minutes')}`}</InfoTag>
            <InfoTag>{`${recipe.servings ?? 0} ${t('home.servings')}`}</InfoTag>
          </View>
          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.subtitle}>{Math.round(recipe.nutrition?.nutrients?.[0]?.amount || 0)} kcal</Text>

          {rId && selectorOptions.length > 0 && (
            <ModalSelector
              data={selectorOptions}
              initValue={t('favorites.assignToCategory')}
              onChange={handleAssignCategory}
              style={styles.selector}
            />
          )}

          <Text style={styles.summary}>{recipe.summary?.replace(/<[^>]*>/g, '')}</Text>

          <View style={styles.separator} />

          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            <View style={styles.section}>
              <Ingredients extendedIngredients={recipe.extendedIngredients || []} />
            </View>
            <View style={styles.section}>
              <Directions steps={recipe.analyzedInstructions?.[0]?.steps || []} />
            </View>
            <View style={styles.section}>
              <InfoTags cuisines={recipe.cuisines || []} dishTypes={recipe.dishTypes || []} />
            </View>
          </ScrollView>
        </View>
        <InfoDetalladaBG style={styles.background} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: FONTS.medium,
  },
  returnButton: {
    position: 'absolute',
    top: 40,
    left: 12,
    zIndex: 10,
  },
  heroContainer: {
    height: BANNER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    paddingTop: 24,
    paddingBottom: 48,
    paddingHorizontal: 16,
  },
  tags: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    textAlign: 'center',
    marginTop: 12,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    textAlign: 'center',
    marginBottom: 12,
  },
  selector: {
    marginVertical: 12,
  },
  summary: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  separator: {
    height: 1,
    width: 160,
    alignSelf: 'center',
    marginVertical: 24,
  },
  section: {
    width: Dimensions.get('window').width,
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    top: -90,
  },
});

export default InfoScreen;
