import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS } from '@/constants/theme';
import type { RecipeSummary } from '../services/spoonacularService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_MAX_HEIGHT = SCREEN_HEIGHT * 0.75;

interface Props {
  recipe?: RecipeSummary;
  isActive?: boolean;
}

const RecipeCard: React.FC<Props> = ({ recipe, isActive = false }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (recipe && isActive) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (recipe) {
      // Cards in the background start visible
      fadeAnim.setValue(1);
    }
  }, [recipe, isActive, fadeAnim]);

  if (!recipe) {
    return null;
  }

  const calories = Math.round(recipe?.nutrition?.nutrients?.[0]?.amount || 0);
  const imageSource = recipe.image || `https://spoonacular.com/recipeImages/${recipe.id}-636x393.jpg`;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ImageBackground source={{ uri: imageSource }} style={styles.card} imageStyle={styles.image}>
        <View style={styles.overlay}>
          <Text numberOfLines={2} style={styles.title}>
            {recipe.title}
          </Text>
          <Text style={styles.subtitle}>{calories} kcal</Text>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    maxHeight: CARD_MAX_HEIGHT,
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
