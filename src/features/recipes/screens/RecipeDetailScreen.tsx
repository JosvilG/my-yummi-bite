import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import RecipeDetailSkeleton from '@/shared/components/RecipeDetailSkeleton';
import { fetchRecipeInfo, type RecipeSummary } from '../services/spoonacularService';
import { useAuth } from '@/app/providers/AuthProvider';
import { useUserCategories } from '../hooks/useUserCategories';
import { useFavoriteRecipes } from '../hooks/useFavoriteRecipes';
import { FONTS } from '@/constants/theme';
import { useColors } from '@/shared/hooks/useColors';
import type { MainStackParamList } from '@/types/navigation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type RecipeDetailScreenProps = NativeStackScreenProps<MainStackParamList, 'Info'>;

const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { id, rId } = route.params || {};
  const { user } = useAuth();
  const { categories } = useUserCategories(user?.uid);
  const { favorites, addFavorite, removeFavorite } = useFavoriteRecipes();
  const colors = useColors();
  
  const [recipe, setRecipe] = useState<RecipeSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  const favoriteDoc = favorites.find(fav => fav.id === id);
  const isFavorite = !!favoriteDoc;

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

  const toggleIngredientCheck = (ingredientId: number) => {
    setCheckedIngredients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ingredientId)) {
        newSet.delete(ingredientId);
      } else {
        newSet.add(ingredientId);
      }
      return newSet;
    });
  };

  const handleFavoritePress = async () => {
    if (!recipe) return;
    
    if (isFavorite && favoriteDoc?.docId) {
      await removeFavorite(favoriteDoc.docId);
    } else if (recipe.image) {
      await addFavorite(id, recipe.image);
    }
  };

  const getDifficultyText = (readyInMinutes: number) => {
    if (readyInMinutes <= 20) return t('recipe.easy');
    if (readyInMinutes <= 45) return t('recipe.medium');
    return t('recipe.hard');
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.tertiary }]}>
        <RecipeDetailSkeleton />
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>{error || t('home.recipeNotFound')}</Text>
      </View>
    );
  }

  const nutrients = recipe.nutrition?.nutrients || [];
  const calories = nutrients.find(n => n.name === 'Calories')?.amount || 0;
  const protein = nutrients.find(n => n.name === 'Protein')?.amount || 0;
  const carbs = nutrients.find(n => n.name === 'Carbohydrates')?.amount || 0;
  const fat = nutrients.find(n => n.name === 'Fat')?.amount || 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.tertiary }]}>
      <View style={[styles.header, { backgroundColor: colors.tertiary }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('recipe.details')}</Text>
        <View style={styles.headerRight}>
          <Pressable onPress={handleFavoritePress} style={styles.headerButton}>
            <Ionicons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={24} 
              color={isFavorite ? colors.primary : colors.text} 
            />
          </Pressable>
          <Pressable style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={[styles.imageContainer, { backgroundColor: colors.background }]}>
            <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
          </View>
        </View>

        <View style={[styles.contentCard, { backgroundColor: colors.background }]}>
          <Text style={[styles.recipeTitle, { color: colors.text }]}>{recipe.title}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="star-outline" size={16} color={colors.textLight} />
              <Text style={[styles.infoText, { color: colors.textLight }]}>4,8</Text>
            </View>
            <View style={[styles.infoDivider, { backgroundColor: colors.tertiary }]} />
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={16} color={colors.textLight} />
              <Text style={[styles.infoText, { color: colors.textLight }]}>{recipe.readyInMinutes} min</Text>
            </View>
            <View style={[styles.infoDivider, { backgroundColor: colors.tertiary }]} />
            <View style={styles.infoItem}>
              <Text style={[styles.infoText, { color: colors.textLight }]}>{getDifficultyText(recipe.readyInMinutes || 30)}</Text>
            </View>
          </View>

          <View style={[styles.tabsContainer, { backgroundColor: colors.tertiary }]}>
            <Pressable
              style={[
                styles.tab, 
                { backgroundColor: activeTab === 'ingredients' ? colors.background : 'transparent' }
              ]}
              onPress={() => setActiveTab('ingredients')}
            >
              <Text style={[
                styles.tabText, 
                { color: activeTab === 'ingredients' ? colors.primary : colors.textLight }
              ]}>
                {t('recipe.ingredients')}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.tab, 
                { backgroundColor: activeTab === 'instructions' ? colors.background : 'transparent' }
              ]}
              onPress={() => setActiveTab('instructions')}
            >
              <Text style={[
                styles.tabText, 
                { color: activeTab === 'instructions' ? colors.primary : colors.textLight }
              ]}>
                {t('recipe.instructions')}
              </Text>
            </Pressable>
          </View>

          {activeTab === 'ingredients' ? (
            <View style={styles.ingredientsList}>
              {recipe.extendedIngredients?.map((ingredient) => {
                const isChecked = checkedIngredients.has(ingredient.id);
                const amount = ingredient.measures?.metric?.amount ?? ingredient.amount ?? '';
                const unit = ingredient.measures?.metric?.unitShort ?? ingredient.unit ?? '';
                
                return (
                  <Pressable
                    key={ingredient.id}
                    style={styles.ingredientRow}
                    onPress={() => toggleIngredientCheck(ingredient.id)}
                  >
                    <View style={[
                      styles.checkbox, 
                      { borderColor: colors.primary },
                      isChecked && { backgroundColor: colors.primary, borderColor: colors.primary }
                    ]}>
                      {isChecked && <Ionicons name="checkmark" size={14} color={colors.background} />}
                    </View>
                    <Image
                      source={{ uri: `https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}` }}
                      style={styles.ingredientImage}
                    />
                    <Text style={[
                      styles.ingredientText, 
                      { color: colors.text },
                      isChecked && { color: colors.textLight, textDecorationLine: 'line-through' }
                    ]}>
                      {amount}{unit} {ingredient.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <View style={styles.instructionsList}>
              {recipe.analyzedInstructions?.[0]?.steps?.map((step, index) => (
                <View key={step.number} style={styles.instructionRow}>
                  <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.stepNumberText, { color: colors.background }]}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.instructionText, { color: colors.text }]}>{step.step}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={[styles.nutritionContainer, { backgroundColor: colors.tertiary }]}>
            <View style={styles.nutritionItem}>
              <Text style={[styles.nutritionValue, { color: colors.text }]}>{Math.round(calories)}</Text>
              <Text style={[styles.nutritionLabel, { color: colors.textLight }]}>kcal</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={[styles.nutritionValue, { color: colors.text }]}>{Math.round(protein)}g</Text>
              <Text style={[styles.nutritionLabel, { color: colors.textLight }]}>{t('recipe.protein')}</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={[styles.nutritionValue, { color: colors.text }]}>{Math.round(carbs)}g</Text>
              <Text style={[styles.nutritionLabel, { color: colors.textLight }]}>{t('recipe.carbs')}</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={[styles.nutritionValue, { color: colors.text }]}>{Math.round(fat)}g</Text>
              <Text style={[styles.nutritionLabel, { color: colors.textLight }]}>{t('recipe.fat')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.medium,
    fontSize: 18,
  },
  headerRight: {
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  imageContainer: {
    width: SCREEN_WIDTH * 0.85,
    aspectRatio: 1.3,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  contentCard: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 24,
    minHeight: 500,
  },
  recipeTitle: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
  infoDivider: {
    width: 1,
    height: 16,
    marginHorizontal: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderRadius: 25,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 22,
    alignItems: 'center',
  },
  tabText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  ingredientsList: {
    marginBottom: 24,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ingredientImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  ingredientText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 15,
  },
  instructionsList: {
    marginBottom: 24,
  },
  instructionRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  instructionText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontFamily: FONTS.bold,
    fontSize: 18,
  },
  nutritionLabel: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    marginTop: 4,
  },
});

export default RecipeDetailScreen;
