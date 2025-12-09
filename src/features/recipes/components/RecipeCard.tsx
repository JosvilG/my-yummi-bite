import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS } from '@/constants/theme';
import type { RecipeSummary } from '../services/spoonacularService';

interface Props {
  recipe?: RecipeSummary;
}

const RecipeCard: React.FC<Props> = ({ recipe }) => {
  if (!recipe) {
    return null;
  }

  const calories = Math.round(recipe?.nutrition?.nutrients?.[0]?.amount || 0);
  const imageSource = recipe.image || `https://spoonacular.com/recipeImages/${recipe.id}-636x393.jpg`;

  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: imageSource }} style={styles.card} imageStyle={styles.image}>
        <View style={styles.overlay}>
          <Text numberOfLines={2} style={styles.title}>
            {recipe.title}
          </Text>
          <Text style={styles.subtitle}>{calories} kcal</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    aspectRatio: 3/ 4.5,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: COLORS.primary,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  image: {
    borderRadius: 24,
  },
  overlay: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  title: {
    color: COLORS.background,
    fontFamily: FONTS.bold,
    fontSize: 22,
  },
  subtitle: {
    marginTop: 8,
    color: COLORS.background,
    fontFamily: FONTS.medium,
    fontSize: 16,
  },
});

export default RecipeCard;
