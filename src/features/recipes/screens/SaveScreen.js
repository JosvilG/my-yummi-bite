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
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { observer } from 'mobx-react-lite';
import { useAuth } from '@/app/providers/AuthProvider';
import { useRecipeStore } from '@/app/providers/RecipeProvider';
import AddCategoryButton from '../components/AddCategoryButton';
import CategoryPill from '../components/CategoryPill';
import RemoveButton from '../components/RemoveButton';
import { useFavoriteRecipes } from '../hooks/useFavoriteRecipes';
import { useUserCategories } from '../hooks/useUserCategories';
import { COLORS, FONTS } from '@/constants/theme';

const { width } = Dimensions.get('window');

const SaveScreen = observer(({ navigation }) => {
  const { user } = useAuth();
  const recipeStore = useRecipeStore();
  const { favorites, loading, removeFavorite } = useFavoriteRecipes();
  const { categories, addCategory, deleteCategory } = useUserCategories(user?.uid);
  const [categoryText, setCategoryText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const filteredRecipes = recipeStore.activeCategory
    ? favorites.filter(recipe => recipe.category === recipeStore.activeCategory)
    : favorites;

  const handleCategoryPress = label => {
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
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteFavorite = async docId => {
    const result = await removeFavorite(docId);
    if (!result?.success) {
      Alert.alert('Error', result?.error || 'Unable to delete recipe');
    }
  };

  const renderRecipe = ({ item, index }) => (
    <View style={[styles.favorite, index % 3 !== 1 && styles.offsetFavorite]}>
      <TouchableOpacity style={styles.removeButton} onPress={() => handleDeleteFavorite(item.docId)}>
        <RemoveButton />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Info', { id: item.id, rId: item.docId })}>
        <Image source={{ uri: item.url }} style={styles.favoriteImage} />
      </TouchableOpacity>
    </View>
  );

  const renderCategories = () => {
    if (categories.length === 0) {
      return <Text style={styles.emptyCategories}>Create your first category to organize recipes</Text>;
    }

    return categories.map(category => (
      <CategoryPill
        key={category.id}
        label={category.category}
        selected={recipeStore.activeCategory === category.category}
        onSelect={handleCategoryPress}
        onDelete={() => deleteCategory(category.id)}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredRecipes}
        numColumns={3}
        keyExtractor={item => item.docId}
        renderItem={renderRecipe}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading && <Text style={styles.emptyState}>You have no saved recipes yet. Start exploring!</Text>
        }
      />

      <LinearGradient colors={['#F23838', '#FCB13A']} style={styles.categoriesPanel}>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <AddCategoryButton />
        </TouchableOpacity>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
          {renderCategories()}
        </ScrollView>
      </LinearGradient>

      <Modal transparent animationType="fade" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Category</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Pasta"
              placeholderTextColor={COLORS.primary}
              value={categoryText}
              onChangeText={setCategoryText}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleAddCategory}>
              <Text style={styles.modalButtonText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: 260,
    paddingHorizontal: 8,
  },
  favorite: {
    width: width / 3,
    height: width / 3,
    padding: 8,
  },
  offsetFavorite: {
    marginTop: 24,
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
  },
  favoriteImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  emptyState: {
    textAlign: 'center',
    marginTop: 80,
    fontFamily: FONTS.medium,
    color: COLORS.textLight,
  },
  categoriesPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    top: -30,
  },
  categoriesRow: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyCategories: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: FONTS.medium,
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: width * 0.8,
    backgroundColor: COLORS.background,
    padding: 24,
    borderRadius: 16,
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    marginBottom: 16,
    color: COLORS.primary,
    textAlign: 'center',
  },
  modalInput: {
    borderBottomWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 8,
    marginBottom: 20,
    color: COLORS.text,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalButtonText: {
    color: COLORS.background,
    fontFamily: FONTS.bold,
  },
  modalCancel: {
    marginTop: 12,
    textAlign: 'center',
    color: COLORS.textLight,
  },
});

export default SaveScreen;
