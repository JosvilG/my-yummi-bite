import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import ReturnHeaderButton from '@/shared/components/ReturnHeaderButton';
import InfoDetalladaBG from '@/shared/icons/infoDetalladaBG';
import Ingredients from '../components/detail/Ingredients';
import Directions from '../components/detail/Directions';
import InfoTags from '../components/detail/InfoTags';
import InfoTag from '../components/InfoTag';
import { fetchRecipeInfo } from '../services/spoonacularService';
import { useAuth } from '@/app/providers/AuthProvider';
import { useUserCategories } from '../hooks/useUserCategories';
import { assignRecipeCategory } from '../services/categoryService';
import { COLORS, FONTS } from '@/constants/theme';

const BANNER_HEIGHT = 340;

const InfoScreen = ({ route, navigation }) => {
  const { id, rId } = route.params || {};
  const { user } = useAuth();
  const { categories } = useUserCategories(user?.uid);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!id) return;

    const loadRecipe = async () => {
      setLoading(true);
      const result = await fetchRecipeInfo(id);
      if (result.success) {
        setRecipe(result.recipe);
        setError(null);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    loadRecipe();
  }, [id]);

  const handleAssignCategory = async option => {
    if (!user?.uid || !rId) return;
    await assignRecipeCategory(user.uid, rId, option.label);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>{error || 'Recipe not found'}</Text>
      </View>
    );
  }

  const selectorOptions = categories.map(category => ({
    key: category.id,
    label: category.category,
  }));

  return (
    <View style={styles.container}>
      <ReturnHeaderButton style={styles.returnButton} onPress={() => navigation.goBack()} />
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
      >
        <View style={styles.heroContainer}>
          <Animated.Image source={{ uri: recipe.image }} style={styles.heroImage(scrollY)} />
        </View>

        <View style={styles.content}>
          <View style={styles.tags}>
            <InfoTag>{`${recipe.readyInMinutes} min`}</InfoTag>
            <InfoTag>{`${recipe.servings} servings`}</InfoTag>
          </View>
          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.subtitle}>{Math.round(recipe.nutrition?.nutrients?.[0]?.amount || 0)} kcal</Text>

          {rId && selectorOptions.length > 0 && (
            <ModalSelector
              data={selectorOptions}
              initValue="Assign to category"
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
    backgroundColor: COLORS.background,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: FONTS.medium,
    color: COLORS.error,
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
  heroImage: scrollY => ({
    height: BANNER_HEIGHT,
    width: '200%',
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
  }),
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
    color: COLORS.background,
    textAlign: 'center',
    marginTop: 12,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    color: COLORS.background,
    textAlign: 'center',
    marginBottom: 12,
  },
  selector: {
    marginVertical: 12,
  },
  summary: {
    color: COLORS.background,
    fontFamily: FONTS.regular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  separator: {
    height: 1,
    width: 160,
    backgroundColor: COLORS.background,
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
