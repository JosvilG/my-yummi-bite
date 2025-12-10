import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  type QuerySnapshot,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '@/app/config/firebase';
import { log } from '@/lib/logger';

export interface UserCategory {
  id: string;
  category: string;
}

const categoriesRef = (userId: string) => collection(db, 'users', userId, 'Categories');

export const listenToCategories = (
  userId: string,
  callback: (categories: UserCategory[]) => void
) => {
  return onSnapshot(categoriesRef(userId), (snapshot: QuerySnapshot<DocumentData>) => {
    const categories: UserCategory[] = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<UserCategory, 'id'>),
    }));
    callback(categories);
  });
};

export const createCategory = async (userId: string, name: string): Promise<void> => {
  log.info('Creating category', { userId, categoryName: name });
  if (!userId) throw new Error('User not authenticated');
  if (!name) throw new Error('Category name required');

  await addDoc(categoriesRef(userId), { category: name });
  log.info('Category created successfully', { categoryName: name });
};

export const removeCategory = async (userId: string, categoryId: string): Promise<void> => {
  log.info('Removing category', { userId, categoryId });
  if (!userId) throw new Error('User not authenticated');
  await deleteDoc(doc(db, 'users', userId, 'Categories', categoryId));
  log.info('Category removed successfully', { categoryId });
};

export const assignRecipeCategory = async (
  userId: string,
  recipeDocId: string,
  category: string
): Promise<void> => {
  if (!userId || !recipeDocId) return;

  log.info('Assigning recipe to category', { recipeDocId, category });
  await updateDoc(doc(db, 'users', userId, 'FavRecipes', recipeDocId), { category });
};
