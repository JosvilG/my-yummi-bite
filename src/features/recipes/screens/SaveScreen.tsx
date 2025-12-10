import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '@/app/providers/AuthProvider';
import { useRecipeStore } from '@/app/providers/RecipeProvider';
import { useFavoriteRecipes } from '../hooks/useFavoriteRecipes';
import { useUserCategories } from '../hooks/useUserCategories';
import AnimatedPressable from '@/shared/components/AnimatedPressable';
import { CUISINES } from '@/constants/recipe';
import { COLORS, FONTS } from '@/constants/theme';
import type { FavoriteRecipeDoc } from '../services/favoriteService';
import type { UserCategory } from '../services/categoryService';
import type { MainStackParamList, TabParamList } from '@/types/navigation';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

type SaveScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Save'>,
  NativeStackScreenProps<MainStackParamList>
>;

const SaveScreen: React.FC<SaveScreenProps> = observer(({ navigation }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const recipeStore = useRecipeStore();
  const { favorites, loading, removeFavorite } = useFavoriteRecipes();
  const { categories, addCategory, deleteCategory } = useUserCategories(user?.uid);
  const [categoryText, setCategoryText] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [cuisineModalVisible, setCuisineModalVisible] = useState<boolean>(false);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);

  let filteredRecipes = recipeStore.activeCategory
    ? favorites.filter(recipe => recipe.category === recipeStore.activeCategory)
    : favorites;

  if (selectedCuisine) {
    filteredRecipes = filteredRecipes.filter(recipe => 
      recipe.cuisines?.some(c => c.toLowerCase() === selectedCuisine.toLowerCase())
    );
  }

  const handleCategoryPress = (label: string) => {
    if (recipeStore.activeCategory === label) {
      recipeStore.setActiveCategory(null);
    } else {
      recipeStore.setActiveCategory(label);
    }
  };

  const handleAddCategory = async () => {
    const trimmed = categoryText.trim();
    if (!trimmed) {
      Alert.alert('Missing name', 'Please provide a category name.');
      return;
    }
    try {
      await addCategory(trimmed);
      setCategoryText('');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleDeleteFavorite = async (docId: string) => {
    Alert.alert(
      t('favorites.deleteTitle'),
      t('favorites.deleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            const result = await removeFavorite(docId);
            if (!result?.success) {
              Alert.alert('Error', result?.error || 'Unable to delete recipe');
            }
          },
        },
      ]
    );
  };

  const renderRecipe = ({ item }: { item: FavoriteRecipeDoc }) => (
    <AnimatedPressable
      style={styles.recipeCard}
      onPress={() => navigation.navigate('Info', { id: item.id, rId: item.docId })}
      scaleValue={0.96}
    >
      <Image source={{ uri: item.url }} style={styles.recipeImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)']}
        style={styles.imageOverlay}
      />
      <View style={styles.cardContent}>
        {item.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.category}</Text>
          </View>
        )}
      </View>
      <AnimatedPressable
        style={styles.deleteButton}
        onPress={() => handleDeleteFavorite(item.docId)}
        scaleValue={0.85}
      >
        <Ionicons name="heart" size={20} color={COLORS.primary} />
      </AnimatedPressable>
    </AnimatedPressable>
  );

  const renderCategoryChip = (category: UserCategory) => {
    const isSelected = recipeStore.activeCategory === category.category;
    return (
      <AnimatedPressable
        key={category.id}
        style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
        onPress={() => handleCategoryPress(category.category)}
        onLongPress={() => {
          Alert.alert(
            t('favorites.deleteCategoryTitle'),
            t('favorites.deleteCategoryMessage'),
            [
              { text: t('common.cancel'), style: 'cancel' },
              {
                text: t('common.delete'),
                style: 'destructive',
                onPress: () => deleteCategory(category.id),
              },
            ]
          );
        }}
        scaleValue={0.92}
      >
        <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>
          {category.category}
        </Text>
      </AnimatedPressable>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="heart-outline" size={64} color={COLORS.secondary} />
      </View>
      <Text style={styles.emptyTitle}>{t('favorites.emptyTitle')}</Text>
      <Text style={styles.emptySubtitle}>{t('favorites.emptySubtitle')}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('favorites.title')}</Text>
        <Text style={styles.headerSubtitle}>
          {filteredRecipes.length} {t('favorites.recipes')}
        </Text>
      </View>

      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
        >
          <AnimatedPressable
            style={[
              styles.categoryChip,
              !recipeStore.activeCategory && styles.categoryChipSelected,
            ]}
            onPress={() => recipeStore.setActiveCategory(null)}
            scaleValue={0.92}
          >
            <Text
              style={[
                styles.categoryChipText,
                !recipeStore.activeCategory && styles.categoryChipTextSelected,
              ]}
            >
              {t('favorites.all')}
            </Text>
          </AnimatedPressable>

          {categories.map(renderCategoryChip)}

          <AnimatedPressable
            style={styles.addCategoryButton}
            onPress={() => setModalVisible(true)}
            scaleValue={0.85}
          >
            <Ionicons name="add" size={20} color={COLORS.primary} />
          </AnimatedPressable>

          <AnimatedPressable
            style={[
              styles.cuisineFilterButton,
              selectedCuisine && styles.cuisineFilterButtonActive,
            ]}
            onPress={() => setCuisineModalVisible(true)}
            scaleValue={0.85}
          >
            <Ionicons 
              name="flag-outline" 
              size={18} 
              color={selectedCuisine ? COLORS.background : COLORS.primary} 
            />
            {selectedCuisine && (
              <Text style={styles.cuisineFilterText}>
                {t(`cuisines.${selectedCuisine.toLowerCase().replace(/\s+/g, '')}`, { defaultValue: selectedCuisine })}
              </Text>
            )}
          </AnimatedPressable>
        </ScrollView>
      </View>

      <FlatList
        data={filteredRecipes}
        numColumns={2}
        keyExtractor={item => item.docId}
        renderItem={renderRecipe}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        columnWrapperStyle={styles.columnWrapper}
      />

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <Ionicons name="folder-outline" size={32} color={COLORS.primary} />
              </View>
              <Text style={styles.modalTitle}>{t('favorites.newCategory')}</Text>
              <Text style={styles.modalSubtitle}>{t('favorites.categoryDescription')}</Text>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder={t('favorites.categoryPlaceholder')}
              placeholderTextColor={COLORS.textLight}
              value={categoryText}
              onChangeText={setCategoryText}
              autoFocus
            />

            <AnimatedPressable style={styles.modalButton} onPress={handleAddCategory} scaleValue={0.96}>
              <Text style={styles.modalButtonText}>{t('favorites.create')}</Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={styles.modalCancelButton}
              onPress={() => setModalVisible(false)}
              scaleValue={0.96}
            >
              <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
            </AnimatedPressable>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={cuisineModalVisible}
        onRequestClose={() => setCuisineModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cuisineModalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <Ionicons name="flag-outline" size={32} color={COLORS.primary} />
              </View>
              <Text style={styles.modalTitle}>{t('favorites.filterByCuisine')}</Text>
              <Text style={styles.modalSubtitle}>{t('favorites.selectCuisine')}</Text>
            </View>

            <ScrollView style={styles.cuisineList} showsVerticalScrollIndicator={false}>
              <AnimatedPressable
                style={[
                  styles.cuisineOption,
                  !selectedCuisine && styles.cuisineOptionSelected,
                ]}
                pressableStyle={styles.cuisineOptionPressable}
                onPress={() => {
                  setSelectedCuisine(null);
                  setCuisineModalVisible(false);
                }}
                scaleValue={0.96}
              >
                <Text style={[
                  styles.cuisineOptionText,
                  !selectedCuisine && styles.cuisineOptionTextSelected,
                ]}>
                  {t('favorites.all')}
                </Text>
                {!selectedCuisine && (
                  <Ionicons name="checkmark" size={20} color={COLORS.background} />
                )}
              </AnimatedPressable>

              {CUISINES.map((cuisine) => (
                <AnimatedPressable
                  key={cuisine}
                  style={[
                    styles.cuisineOption,
                    selectedCuisine === cuisine && styles.cuisineOptionSelected,
                  ]}
                  pressableStyle={styles.cuisineOptionPressable}
                  onPress={() => {
                    setSelectedCuisine(cuisine);
                    setCuisineModalVisible(false);
                  }}
                  scaleValue={0.96}
                >
                  <Text style={[
                    styles.cuisineOptionText,
                    selectedCuisine === cuisine && styles.cuisineOptionTextSelected,
                  ]}>
                    {t(`cuisines.${cuisine.toLowerCase().replace(/\s+/g, '')}`, { defaultValue: cuisine })}
                  </Text>
                  {selectedCuisine === cuisine && (
                    <Ionicons name="checkmark" size={20} color={COLORS.background} />
                  )}
                </AnimatedPressable>
              ))}
            </ScrollView>

            <AnimatedPressable
              style={styles.modalCancelButton}
              onPress={() => setCuisineModalVisible(false)}
              scaleValue={0.96}
            >
              <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
            </AnimatedPressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.tertiary,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginTop: 4,
  },
  categoriesSection: {
    paddingBottom: 12,
  },
  categoriesScrollContent: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  categoryChipTextSelected: {
    color: COLORS.background,
  },
  addCategoryButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cuisineFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
    gap: 6,
  },
  cuisineFilterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  cuisineFilterText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  recipeCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.3,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.background,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: width * 0.85,
    backgroundColor: COLORS.background,
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.text,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 8,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    color: COLORS.text,
    fontFamily: FONTS.regular,
    fontSize: 16,
    backgroundColor: COLORS.tertiary,
  },
  modalButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: COLORS.background,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  modalCancelButton: {
    marginTop: 12,
    paddingVertical: 8,
  },
  modalCancelText: {
    color: COLORS.textLight,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  cuisineModalCard: {
    backgroundColor: COLORS.background,
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  cuisineList: {
    maxHeight: 350,
    width: '100%',
    marginTop: 16,
  },
  cuisineOption: {
    borderRadius: 12,
    backgroundColor: COLORS.tertiary,
    marginBottom: 8,
  },
  cuisineOptionPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  cuisineOptionSelected: {
    backgroundColor: COLORS.accent,
  },
  cuisineOptionText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.text,
  },
  cuisineOptionTextSelected: {
    color: COLORS.background,
  },
});

export default SaveScreen;
