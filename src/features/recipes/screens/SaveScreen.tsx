import React, { useState, useCallback } from 'react';
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
  Vibration,
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
import { updateRecipeCategory } from '../services/favoriteService';
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
  const [assignCategoryModalVisible, setAssignCategoryModalVisible] = useState<boolean>(false);
  const [selectedRecipeForCategory, setSelectedRecipeForCategory] = useState<FavoriteRecipeDoc | null>(null);
  const [assigningCategory, setAssigningCategory] = useState<boolean>(false);
  const [selectionMode, setSelectionMode] = useState<boolean>(false);
  const [selectedRecipes, setSelectedRecipes] = useState<Set<string>>(new Set());
  const [deleteCategoryModalVisible, setDeleteCategoryModalVisible] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<UserCategory | null>(null);

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

  const handleRecipeLongPress = useCallback((recipe: FavoriteRecipeDoc) => {
    if (!selectionMode) {
      Vibration.vibrate(50);
      setSelectionMode(true);
      setSelectedRecipes(new Set([recipe.docId]));
    }
  }, [selectionMode]);

  const handleRecipePress = useCallback((recipe: FavoriteRecipeDoc) => {
    if (selectionMode) {
      setSelectedRecipes(prev => {
        const newSet = new Set(prev);
        if (newSet.has(recipe.docId)) {
          newSet.delete(recipe.docId);
          if (newSet.size === 0) {
            setSelectionMode(false);
          }
        } else {
          newSet.add(recipe.docId);
        }
        return newSet;
      });
    } else {
      navigation.navigate('Info', { id: recipe.id, rId: recipe.docId });
    }
  }, [selectionMode, navigation]);

  const handleCancelSelection = useCallback(() => {
    setSelectionMode(false);
    setSelectedRecipes(new Set());
  }, []);

  const handleOpenCategoryModal = useCallback(() => {
    setAssignCategoryModalVisible(true);
  }, []);

  const handleAssignCategoryToSelected = async (categoryName: string | null) => {
    if (!user?.uid || selectedRecipes.size === 0) return;
    
    setAssigningCategory(true);
    try {
      const promises = Array.from(selectedRecipes).map(docId =>
        updateRecipeCategory(user.uid, docId, categoryName)
      );
      
      const results = await Promise.all(promises);
      const failed = results.filter(r => !r.success);
      
      if (failed.length > 0) {
        Alert.alert('Error', t('favorites.someAssignmentsFailed'));
      }
    } catch (error) {
      Alert.alert('Error', t('favorites.assignCategoryError'));
    } finally {
      setAssigningCategory(false);
      setAssignCategoryModalVisible(false);
      setSelectionMode(false);
      setSelectedRecipes(new Set());
    }
  };

  const handleAssignCategory = async (categoryName: string | null) => {
    if (!selectedRecipeForCategory || !user?.uid) return;
    
    setAssigningCategory(true);
    try {
      const result = await updateRecipeCategory(
        user.uid,
        selectedRecipeForCategory.docId,
        categoryName
      );
      
      if (!result.success) {
        Alert.alert('Error', result.error || t('favorites.assignCategoryError'));
      }
    } catch (error) {
      Alert.alert('Error', t('favorites.assignCategoryError'));
    } finally {
      setAssigningCategory(false);
      setAssignCategoryModalVisible(false);
      setSelectedRecipeForCategory(null);
    }
  };

  const renderRecipe = ({ item }: { item: FavoriteRecipeDoc }) => {
    const isSelected = selectedRecipes.has(item.docId);
    
    return (
      <AnimatedPressable
        style={[styles.recipeCard, selectionMode && isSelected && styles.recipeCardSelected]}
        onPress={() => handleRecipePress(item)}
        onLongPress={() => handleRecipeLongPress(item)}
        scaleValue={0.96}
      >
        <Image source={{ uri: item.url }} style={styles.recipeImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={styles.imageOverlay}
        />
        {selectionMode && (
          <View style={styles.selectionOverlay}>
            <View style={[styles.selectionCheckbox, isSelected && styles.selectionCheckboxSelected]}>
              {isSelected && <Ionicons name="checkmark" size={18} color={COLORS.background} />}
            </View>
          </View>
        )}
        <View style={styles.cardContent}>
          {item.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{item.category}</Text>
            </View>
          )}
        </View>
        {!selectionMode && (
          <AnimatedPressable
            style={styles.deleteButton}
            onPress={() => handleDeleteFavorite(item.docId)}
            scaleValue={0.85}
          >
            <Ionicons name="heart" size={20} color={COLORS.primary} />
          </AnimatedPressable>
        )}
      </AnimatedPressable>
    );
  };

  const renderCategoryChip = (category: UserCategory) => {
    const isSelected = recipeStore.activeCategory === category.category;
    return (
      <AnimatedPressable
        key={category.id}
        style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
        onPress={() => handleCategoryPress(category.category)}
        onLongPress={() => {
          setCategoryToDelete(category);
          setDeleteCategoryModalVisible(true);
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
      {selectionMode ? (
        <View style={styles.selectionHeader}>
          <AnimatedPressable
            style={styles.selectionCancelButton}
            onPress={handleCancelSelection}
            scaleValue={0.92}
          >
            <Ionicons name="close" size={24} color={COLORS.text} />
          </AnimatedPressable>
          <Text style={styles.selectionHeaderTitle}>
            {selectedRecipes.size} {t('favorites.selected')}
          </Text>
          <View style={styles.selectionHeaderSpacer} />
        </View>
      ) : (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('favorites.title')}</Text>
          <Text style={styles.headerSubtitle}>
            {filteredRecipes.length} {t('favorites.recipes')}
          </Text>
        </View>
      )}

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
            <View style={styles.cuisineFilterContent}>
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
            </View>
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

      <Modal
        transparent
        animationType="fade"
        visible={assignCategoryModalVisible}
        onRequestClose={() => {
          setAssignCategoryModalVisible(false);
          setSelectedRecipeForCategory(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cuisineModalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <Ionicons name="folder-open-outline" size={32} color={COLORS.primary} />
              </View>
              <Text style={styles.modalTitle}>{t('favorites.assignToCategory')}</Text>
              <Text style={styles.modalSubtitle}>
                {selectionMode 
                  ? t('favorites.selectCategoryForRecipes', { count: selectedRecipes.size })
                  : t('favorites.selectCategoryForRecipe')
                }
              </Text>
            </View>

            <ScrollView style={styles.cuisineList} showsVerticalScrollIndicator={false}>
              <AnimatedPressable
                style={styles.cuisineOption}
                pressableStyle={styles.cuisineOptionPressable}
                onPress={() => selectionMode ? handleAssignCategoryToSelected(null) : handleAssignCategory(null)}
                scaleValue={0.96}
              >
                <View style={styles.categoryOptionContent}>
                  <Ionicons name="close-circle-outline" size={20} color={COLORS.textLight} />
                  <Text style={styles.cuisineOptionText}>
                    {t('favorites.noCategory')}
                  </Text>
                </View>
              </AnimatedPressable>

              {categories.map((category) => (
                <AnimatedPressable
                  key={category.id}
                  style={styles.cuisineOption}
                  pressableStyle={styles.cuisineOptionPressable}
                  onPress={() => selectionMode ? handleAssignCategoryToSelected(category.category) : handleAssignCategory(category.category)}
                  scaleValue={0.96}
                >
                  <View style={styles.categoryOptionContent}>
                    <Ionicons 
                      name="folder-outline" 
                      size={20} 
                      color={COLORS.primary} 
                    />
                    <Text style={styles.cuisineOptionText}>
                      {category.category}
                    </Text>
                  </View>
                </AnimatedPressable>
              ))}
            </ScrollView>

            {assigningCategory && (
              <View style={styles.assigningIndicator}>
                <Text style={styles.assigningText}>{t('common.saving')}</Text>
              </View>
            )}

            <AnimatedPressable
              style={styles.modalCancelButton}
              onPress={() => {
                setAssignCategoryModalVisible(false);
                setSelectedRecipeForCategory(null);
              }}
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
        visible={deleteCategoryModalVisible}
        onRequestClose={() => {
          setDeleteCategoryModalVisible(false);
          setCategoryToDelete(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteCategoryModalCard}>
            <View style={styles.deleteCategoryIconContainer}>
              <Ionicons name="trash-outline" size={36} color={COLORS.primary} />
            </View>
            
            <Text style={styles.deleteCategoryTitle}>{t('favorites.deleteCategoryTitle')}</Text>
            
            {categoryToDelete && (
              <View style={styles.deleteCategoryNameContainer}>
                <Text style={styles.deleteCategoryName}>{categoryToDelete.category}</Text>
              </View>
            )}
            
            <Text style={styles.deleteCategoryMessage}>{t('favorites.deleteCategoryMessage')}</Text>
            
            <View style={styles.deleteCategoryButtons}>
              <AnimatedPressable
                style={styles.deleteCategoryCancelButton}
                onPress={() => {
                  setDeleteCategoryModalVisible(false);
                  setCategoryToDelete(null);
                }}
                scaleValue={0.96}
              >
                <Text style={styles.deleteCategoryCancelText}>{t('common.cancel')}</Text>
              </AnimatedPressable>
              
              <AnimatedPressable
                style={styles.deleteCategoryConfirmButton}
                onPress={() => {
                  if (categoryToDelete) {
                    deleteCategory(categoryToDelete.id);
                  }
                  setDeleteCategoryModalVisible(false);
                  setCategoryToDelete(null);
                }}
                scaleValue={0.96}
              >
                <View style={styles.deleteCategoryConfirmContent}>
                  <Ionicons name="trash" size={16} color={COLORS.background} />
                  <Text style={styles.deleteCategoryConfirmText}>{t('common.delete')}</Text>
                </View>
              </AnimatedPressable>
            </View>
          </View>
        </View>
      </Modal>

      {selectionMode && selectedRecipes.size > 0 && (
        <View style={styles.selectionActionBar}>
          <AnimatedPressable
            style={styles.selectionActionButton}
            onPress={handleOpenCategoryModal}
            scaleValue={0.92}
          >
            <Ionicons name="folder-open-outline" size={24} color={COLORS.background} />
            <Text style={styles.selectionActionText}>{t('favorites.moveToCategory')}</Text>
          </AnimatedPressable>
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  cuisineFilterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  cuisineFilterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  categoryOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  assigningIndicator: {
    marginTop: 12,
    paddingVertical: 8,
  },
  assigningText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.primary,
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.tertiary,
  },
  selectionCancelButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionHeaderTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    textAlign: 'center',
  },
  selectionHeaderSpacer: {
    width: 40,
  },
  recipeCardSelected: {
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  selectionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10,
  },
  selectionCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionCheckboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  selectionActionBar: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  selectionActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  selectionActionText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.background,
  },
  deleteCategoryModalCard: {
    backgroundColor: COLORS.background,
    borderRadius: 24,
    padding: 24,
    width: '85%',
    maxWidth: 340,
    alignItems: 'center',
  },
  deleteCategoryIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteCategoryTitle: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  deleteCategoryNameContainer: {
    backgroundColor: COLORS.tertiary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
  },
  deleteCategoryName: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.primary,
  },
  deleteCategoryMessage: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  deleteCategoryButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  deleteCategoryCancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteCategoryCancelText: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: COLORS.text,
  },
  deleteCategoryConfirmButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  deleteCategoryConfirmContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  deleteCategoryConfirmText: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.background,
  },
});

export default SaveScreen;
