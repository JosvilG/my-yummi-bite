import React from 'react';
import { 
  Dimensions, 
  Image, 
  StyleSheet, 
  Text, 
  View 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FONTS } from '@/constants/theme';
import { useColors } from '@/shared/hooks/useColors';
import AnimatedPressable from '@/shared/components/AnimatedPressable';
import type { RecipeSummary } from '../services/spoonacularService';
import type { MainStackParamList } from '@/types/navigation';
import { log } from '@/lib/logger';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT * 0.75;

const getHighResImageUrl = (recipe: RecipeSummary): string => {
  if (recipe.image) {
    const sizePattern = /-\d+x\d+\./;
    if (sizePattern.test(recipe.image)) {
      return recipe.image.replace(sizePattern, '-636x393.');
    }
    return recipe.image;
  }
  return `https://img.spoonacular.com/recipes/${recipe.id}-636x393.jpg`;
};

interface Props {
  recipe?: RecipeSummary;
  onSkip?: () => void;
  onSave?: () => void;
}

const RecipeCard: React.FC<Props> = ({ recipe, onSkip, onSave }) => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const colors = useColors();

  if (!recipe) {
    return null;
  }

  const calories = Math.round(recipe?.nutrition?.nutrients?.[0]?.amount || 0);
  const imageSource = getHighResImageUrl(recipe);
  const summary = recipe.summary?.replace(/<[^>]*>/g, '').slice(0, 120) + '...';

  const handleInfoPress = () => {
    log.info('Navigation to recipe details', { recipeId: recipe.id, title: recipe.title });
    navigation.navigate('Info', { id: recipe.id });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: colors.background }]}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageSource }} style={styles.recipeImage} />
        </View>

        <View style={styles.infoContainer}>
          <Text numberOfLines={2} style={[styles.title, { color: colors.primary }]}>{recipe.title}</Text>
          <Text style={[styles.calories, { color: colors.accent }]}>{calories} kcal</Text>
          
          <Text numberOfLines={4} style={[styles.summary, { color: colors.textLight }]}>
            {summary}
          </Text>

          <View style={styles.actions}>
            <AnimatedPressable 
              style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.error }]} 
              onPress={onSkip}
              scaleValue={0.85}
            >
              <Ionicons name="close" size={28} color={colors.error} />
            </AnimatedPressable>
            
            <AnimatedPressable 
              style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.teal }]} 
              onPress={handleInfoPress}
              scaleValue={0.85}
            >
              <Ionicons name="information" size={24} color={colors.teal} />
            </AnimatedPressable>
            
            <AnimatedPressable 
              style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.teal }]} 
              onPress={onSave}
              scaleValue={0.85}
            >
              <Ionicons name="heart" size={28} color={colors.teal} />
            </AnimatedPressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: CARD_HEIGHT,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  imageContainer: {
    flex: 1,
    minHeight: '50%',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    textAlign: 'center',
  },
  calories: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    marginTop: 4,
  },
  summary: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 20,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default RecipeCard;
