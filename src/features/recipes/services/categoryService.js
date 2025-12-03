import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/app/config/firebase';

const categoriesRef = userId => collection(db, 'users', userId, 'Categories');

export const listenToCategories = (userId, callback) => {
  return onSnapshot(categoriesRef(userId), snapshot => {
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(categories);
  });
};

export const createCategory = async (userId, name) => {
  if (!userId) throw new Error('User not authenticated');
  if (!name) throw new Error('Category name required');

  await addDoc(categoriesRef(userId), { category: name });
};

export const removeCategory = async (userId, categoryId) => {
  if (!userId) throw new Error('User not authenticated');
  await deleteDoc(doc(db, 'users', userId, 'Categories', categoryId));
};

export const assignRecipeCategory = async (userId, recipeDocId, category) => {
  if (!userId || !recipeDocId) return;

  await updateDoc(doc(db, 'users', userId, 'FavRecipes', recipeDocId), { category });
};
