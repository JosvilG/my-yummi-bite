import React, { useState, useCallback } from 'react';
import {
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
import { FONTS } from '@/constants/theme';
import { useColors } from '@/shared/hooks/useColors';
import { updateRecipeCategory } from '../services/favoriteService';
import type { FavoriteRecipeDoc } from '../services/favoriteService';
import type { UserCategory } from '../services/categoryService';
import type { MainStackParamList, TabParamList } from '@/types/navigation';
import { log } from '@/lib/logger';
import { useAppAlertModal } from '@/shared/hooks/useAppAlertModal';
import { setPublishedRecipeSave } from '@/features/social/services/publishedRecipeService';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

type SaveScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Save'>,
  NativeStackScreenProps<MainStackParamList>
>;

const SaveScreen: React.FC<SaveScreenProps> = observer(({ navigation }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const colors = useColors();
  const recipeStore = useRecipeStore();
  const { favorites, loading, removeFavorite } = useFavoriteRecipes();
  const { categories, addCategory, deleteCategory } = useUserCategories(user?.uid);
  const { showInfo, showConfirm, modal: alertModal } = useAppAlertModal();
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
      showInfo({ title: 'Missing name', message: 'Please provide a category name.', confirmText: t('common.close') });
      return;
    }
    try {
      await addCategory(trimmed);
      setCategoryText('');
      setModalVisible(false);
    } catch (error) {
      showInfo({
        title: t('common.error'),
        message: error instanceof Error ? error.message : t('common.unknownError'),
        confirmText: t('common.close'),
      });
    }
  };

  const handleDeleteFavorite = async (docId: string) => {
    const recipeToDelete = favorites.find(r => r.docId === docId);
    showConfirm({
      title: t('favorites.deleteTitle'),
      message: t('favorites.deleteMessage'),
      confirmText: t('common.delete'),
      cancelText: t('common.cancel'),
      confirmVariant: 'destructive',
      iconName: 'trash-outline',
      onConfirm: async () => {
        const result = await removeFavorite(docId);
        if (!result?.success) {
          showInfo({
            title: t('common.error'),
            message: result?.error || 'Unable to delete recipe',
            confirmText: t('common.close'),
          });
          return;
        }

        if (user?.uid && recipeToDelete?.source === 'published' && recipeToDelete.publishedId) {
          await setPublishedRecipeSave(recipeToDelete.publishedId, user.uid, false);
        }
      },
    });
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
      log.info('Navigation to recipe details', { recipeId: recipe.id, from: 'SaveScreen' });
      if (recipe.source === 'published' && recipe.publishedId) {
        navigation.navigate('PublishedInfo', { id: recipe.publishedId });
        return;
      }
      navigation.navigate('Info', {
        id: recipe.id,
        rId: recipe.docId,
        source: recipe.source === 'custom' ? 'custom' : 'spoonacular',
      });
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
        showInfo({ title: t('common.error'), message: t('favorites.someAssignmentsFailed'), confirmText: t('common.close') });
      }
    } catch (error) {
      showInfo({ title: t('common.error'), message: t('favorites.assignCategoryError'), confirmText: t('common.close') });
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
        showInfo({
          title: t('common.error'),
          message: result.error || t('favorites.assignCategoryError'),
          confirmText: t('common.close'),
        });
      }
    } catch (error) {
      showInfo({ title: t('common.error'), message: t('favorites.assignCategoryError'), confirmText: t('common.close') });
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
              {isSelected && <Ionicons name="checkmark" size={18} color={colors.background} />}
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
            onPress={(event: any) => {
              event?.stopPropagation?.();
              handleDeleteFavorite(item.docId);
            }}
            scaleValue={0.85}
          >
            <Ionicons name="heart" size={20} color={colors.primary} />
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
        style={[
          styles.categoryChip,
          { backgroundColor: isSelected ? colors.primary : colors.background, borderColor: isSelected ? colors.primary : colors.border },
        ]}
        onPress={() => handleCategoryPress(category.category)}
        onLongPress={() => {
          setCategoryToDelete(category);
          setDeleteCategoryModalVisible(true);
        }}
        scaleValue={0.92}
      >
        <Text style={[styles.categoryChipText, { color: isSelected ? colors.background : colors.text }]}>
          {category.category}
        </Text>
      </AnimatedPressable>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="heart-outline" size={64} color={colors.secondary} />
      </View>
      <Text style={styles.emptyTitle}>{t('favorites.emptyTitle')}</Text>
      <Text style={styles.emptySubtitle}>{t('favorites.emptySubtitle')}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.tertiary }]} edges={['top']}>
      {selectionMode ? (
        <View style={styles.selectionHeader}>
          <AnimatedPressable
            style={styles.selectionCancelButton}
            onPress={handleCancelSelection}
            scaleValue={0.92}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </AnimatedPressable>
          <Text style={styles.selectionHeaderTitle}>
            {selectedRecipes.size} {t('favorites.selected')}
          </Text>
          <View style={styles.selectionHeaderSpacer} />
        </View>
      ) : (
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('favorites.title')}</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textLight }]}>
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
              { backgroundColor: !recipeStore.activeCategory ? colors.primary : colors.background, borderColor: !recipeStore.activeCategory ? colors.primary : colors.border },
            ]}
            onPress={() => recipeStore.setActiveCategory(null)}
            scaleValue={0.92}
          >
            <Text
              style={[
                styles.categoryChipText,
                { color: !recipeStore.activeCategory ? colors.background : colors.text },
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
            <Ionicons name="add" size={20} color={colors.primary} />
          </AnimatedPressable>

          <AnimatedPressable
            style={[
              styles.cuisineFilterButton,
              { 
                backgroundColor: selectedCuisine ? colors.primary : colors.background,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => setCuisineModalVisible(true)}
            scaleValue={0.85}
          >
            <View style={styles.cuisineFilterContent}>
              <Ionicons 
                name="flag-outline" 
                size={18} 
                color={selectedCuisine ? colors.background : colors.primary} 
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
          <View style={[styles.modalCard, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalIconContainer, { backgroundColor: colors.tertiary }]}>
                <Ionicons name="folder-outline" size={32} color={colors.primary} />
              </View>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{t('favorites.newCategory')}</Text>
              <Text style={[styles.modalSubtitle, { color: colors.textLight }]}>{t('favorites.categoryDescription')}</Text>
            </View>

            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.tertiary, borderColor: colors.border, color: colors.text }]}
              placeholder={t('favorites.categoryPlaceholder')}
              placeholderTextColor={colors.textLight}
              value={categoryText}
              onChangeText={setCategoryText}
              autoFocus
            />

            <AnimatedPressable style={[styles.modalButton, { backgroundColor: colors.primary }]} onPress={handleAddCategory} scaleValue={0.96}>
              <Text style={[styles.modalButtonText, { color: colors.background }]}>{t('favorites.create')}</Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={styles.modalCancelButton}
              onPress={() => setModalVisible(false)}
              scaleValue={0.96}
            >
              <Text style={[styles.modalCancelText, { color: colors.textLight }]}>{t('common.cancel')}</Text>
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
          <View style={[styles.cuisineModalCard, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalIconContainer, { backgroundColor: colors.tertiary }]}>
                <Ionicons name="flag-outline" size={32} color={colors.primary} />
              </View>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{t('favorites.filterByCuisine')}</Text>
              <Text style={[styles.modalSubtitle, { color: colors.textLight }]}>{t('favorites.selectCuisine')}</Text>
            </View>

            <ScrollView style={styles.cuisineList} showsVerticalScrollIndicator={false}>
              <AnimatedPressable
                style={[
                  styles.cuisineOption,
                  { backgroundColor: !selectedCuisine ? colors.primary : colors.tertiary },
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
                  { color: !selectedCuisine ? colors.background : colors.text },
                ]}>
                  {t('favorites.all')}
                </Text>
                {!selectedCuisine && (
                  <Ionicons name="checkmark" size={20} color={colors.background} />
                )}
              </AnimatedPressable>

              {CUISINES.map((cuisine) => (
                <AnimatedPressable
                  key={cuisine}
                  style={[
                    styles.cuisineOption,
                    { backgroundColor: selectedCuisine === cuisine ? colors.primary : colors.tertiary },
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
                    { color: selectedCuisine === cuisine ? colors.background : colors.text },
                  ]}>
                    {t(`cuisines.${cuisine.toLowerCase().replace(/\s+/g, '')}`, { defaultValue: cuisine })}
                  </Text>
                  {selectedCuisine === cuisine && (
                    <Ionicons name="checkmark" size={20} color={colors.background} />
                  )}
                </AnimatedPressable>
              ))}
            </ScrollView>

            <AnimatedPressable
              style={styles.modalCancelButton}
              onPress={() => setCuisineModalVisible(false)}
              scaleValue={0.96}
            >
              <Text style={[styles.modalCancelText, { color: colors.textLight }]}>{t('common.cancel')}</Text>
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
          <View style={[styles.cuisineModalCard, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalIconContainer, { backgroundColor: colors.tertiary }]}>
                <Ionicons name="folder-open-outline" size={32} color={colors.primary} />
              </View>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{t('favorites.assignToCategory')}</Text>
              <Text style={[styles.modalSubtitle, { color: colors.textLight }]}>
                {selectionMode 
                  ? t('favorites.selectCategoryForRecipes', { count: selectedRecipes.size })
                  : t('favorites.selectCategoryForRecipe')
                }
              </Text>
            </View>

            <ScrollView style={styles.cuisineList} showsVerticalScrollIndicator={false}>
              <AnimatedPressable
                style={[styles.cuisineOption, { backgroundColor: colors.tertiary }]}
                pressableStyle={styles.cuisineOptionPressable}
                onPress={() => selectionMode ? handleAssignCategoryToSelected(null) : handleAssignCategory(null)}
                scaleValue={0.96}
              >
                <View style={styles.categoryOptionContent}>
                  <Ionicons name="close-circle-outline" size={20} color={colors.textLight} />
                  <Text style={[styles.cuisineOptionText, { color: colors.text }]}>
                    {t('favorites.noCategory')}
                  </Text>
                </View>
              </AnimatedPressable>

              {categories.map((category) => (
                <AnimatedPressable
                  key={category.id}
                  style={[styles.cuisineOption, { backgroundColor: colors.tertiary }]}
                  pressableStyle={styles.cuisineOptionPressable}
                  onPress={() => selectionMode ? handleAssignCategoryToSelected(category.category) : handleAssignCategory(category.category)}
                  scaleValue={0.96}
                >
                  <View style={styles.categoryOptionContent}>
                    <Ionicons 
                      name="folder-outline" 
                      size={20} 
                      color={colors.primary} 
                    />
                    <Text style={[styles.cuisineOptionText, { color: colors.text }]}>
                      {category.category}
                    </Text>
                  </View>
                </AnimatedPressable>
              ))}
            </ScrollView>

            {assigningCategory && (
              <View style={styles.assigningIndicator}>
                <Text style={[styles.assigningText, { color: colors.primary }]}>{t('common.saving')}</Text>
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
              <Text style={[styles.modalCancelText, { color: colors.textLight }]}>{t('common.cancel')}</Text>
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
          <View style={[styles.deleteCategoryModalCard, { backgroundColor: colors.background }]}>
            <View style={[styles.deleteCategoryIconContainer, { backgroundColor: colors.tertiary }]}>
              <Ionicons name="trash-outline" size={36} color={colors.primary} />
            </View>
            
            <Text style={[styles.deleteCategoryTitle, { color: colors.text }]}>{t('favorites.deleteCategoryTitle')}</Text>
            
            {categoryToDelete && (
              <View style={[styles.deleteCategoryNameContainer, { backgroundColor: colors.tertiary }]}>
                <Text style={[styles.deleteCategoryName, { color: colors.primary }]}>{categoryToDelete.category}</Text>
              </View>
            )}
            
            <Text style={[styles.deleteCategoryMessage, { color: colors.textLight }]}>{t('favorites.deleteCategoryMessage')}</Text>
            
            <View style={styles.deleteCategoryButtons}>
              <AnimatedPressable
                style={[styles.deleteCategoryCancelButton, { backgroundColor: colors.tertiary }]}
                onPress={() => {
                  setDeleteCategoryModalVisible(false);
                  setCategoryToDelete(null);
                }}
                scaleValue={0.96}
              >
                <Text style={[styles.deleteCategoryCancelText, { color: colors.text }]}>{t('common.cancel')}</Text>
              </AnimatedPressable>
              
              <AnimatedPressable
                style={[styles.deleteCategoryConfirmButton, { backgroundColor: colors.primary }]}
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
                  <Ionicons name="trash" size={16} color={colors.background} />
                  <Text style={[styles.deleteCategoryConfirmText, { color: colors.background }]}>{t('common.delete')}</Text>
                </View>
              </AnimatedPressable>
            </View>
          </View>
        </View>
      </Modal>

      {selectionMode && selectedRecipes.size > 0 && (
        <View style={[styles.selectionActionBar, { backgroundColor: colors.primary }]}>
          <AnimatedPressable
            pressableStyle={styles.selectionActionButton}
            onPress={handleOpenCategoryModal}
            scaleValue={0.92}
          >
            <Ionicons name="folder-open-outline" size={24} color={colors.background} />
            <Text style={[styles.selectionActionText, { color: colors.background }]}>{t('favorites.moveToCategory')}</Text>
          </AnimatedPressable>
        </View>
      )}
      {alertModal}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: FONTS.bold,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
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
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  addCategoryButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cuisineFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
  },
  cuisineFilterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cuisineFilterText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
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
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    fontFamily: FONTS.regular,
    fontSize: 16,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  modalCancelButton: {
    marginTop: 12,
    paddingVertical: 8,
  },
  modalCancelText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  cuisineModalCard: {
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
    marginBottom: 8,
  },
  cuisineOptionPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  cuisineOptionText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
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
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectionCancelButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionHeaderTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: FONTS.bold,
    textAlign: 'center',
  },
  selectionHeaderSpacer: {
    width: 40,
  },
  recipeCardSelected: {
    borderWidth: 3,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionCheckboxSelected: {
  },
  selectionActionBar: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
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
  },
  deleteCategoryModalCard: {
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteCategoryTitle: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 12,
  },
  deleteCategoryNameContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
  },
  deleteCategoryName: {
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  deleteCategoryMessage: {
    fontFamily: FONTS.regular,
    fontSize: 14,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteCategoryCancelText: {
    fontFamily: FONTS.medium,
    fontSize: 15,
  },
  deleteCategoryConfirmButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
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
  },
});

export default SaveScreen;
