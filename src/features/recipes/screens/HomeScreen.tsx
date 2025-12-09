import React, { useEffect } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useRecipeStore } from '@/app/providers/RecipeProvider';
import { useAuth } from '@/app/providers/AuthProvider';
import FilterPill from '../components/FilterPill';
import RecipeCard from '../components/RecipeCard';
import VerifyButton from '../components/VerifyButton';
import HomeBackground from '@/shared/icons/HomeBackground';
import { saveFavoriteRecipe } from '../services/favoriteService';
import { CUISINES } from '@/constants/recipe';
import { COLORS, FONTS } from '@/constants/theme';
import type { RecipeSummary } from '../services/spoonacularService';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = observer(() => {
  const recipeStore = useRecipeStore();
  const { user } = useAuth();
  const recipe: RecipeSummary | undefined = recipeStore.randomRecipe?.[0];

  useEffect(() => {
    recipeStore.loadRandomRecipe();
  }, [recipeStore]);

  const handleToggleFilter = (cuisine: string) => {
    if (recipeStore.filters.includes(cuisine)) {
      recipeStore.removeFilter(cuisine);
    } else {
      recipeStore.addFilter(cuisine);
    }
    recipeStore.loadRandomRecipe();
  };

  const handleSkipRecipe = () => {
    recipeStore.loadRandomRecipe();
  };

  const handleSaveRecipe = async () => {
    if (!user?.uid || !recipe) return;
    await saveFavoriteRecipe(user.uid, recipe.id, recipe.image ?? '');
    recipeStore.loadRandomRecipe();
  };

  const isLoading = recipeStore.loading || !recipe;

  return (
    <View style={styles.container}>
      <HomeBackground style={styles.background} />
      <View style={styles.content}>
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

        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loaderText}>Discovering a new dish...</Text>
          </View>
        ) : (
          <RecipeCard recipe={recipe} />
        )}
      </View>

      <View style={styles.actions}>
        <VerifyButton variant="reject" onPress={handleSkipRecipe} />
        <VerifyButton variant="accept" size={72} onPress={handleSaveRecipe} />
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
    alignItems: 'center',
    paddingTop: 40,
  },
  filters: {
    paddingHorizontal: 16,
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 32,
    paddingHorizontal: 32,
  },
});

export default HomeScreen;
