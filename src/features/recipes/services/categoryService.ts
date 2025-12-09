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
  if (!userId) throw new Error('User not authenticated');
  if (!name) throw new Error('Category name required');

  await addDoc(categoriesRef(userId), { category: name });
};

export const removeCategory = async (userId: string, categoryId: string): Promise<void> => {
  if (!userId) throw new Error('User not authenticated');
  await deleteDoc(doc(db, 'users', userId, 'Categories', categoryId));
};

export const assignRecipeCategory = async (
  userId: string,
  recipeDocId: string,
  category: string
): Promise<void> => {
  if (!userId || !recipeDocId) return;

  await updateDoc(doc(db, 'users', userId, 'FavRecipes', recipeDocId), { category });
};
