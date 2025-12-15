import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db, serverTimestamp } from '@/app/config/firebase';
import { captureException } from '@/lib/sentry';

const deleteCollection = async (colRef: ReturnType<typeof collection>) => {
  const snapshot = await getDocs(colRef);
  if (snapshot.empty) return;

  const docs = snapshot.docs;
  for (let i = 0; i < docs.length; i += 450) {
    const batch = writeBatch(db);
    docs.slice(i, i + 450).forEach((docSnap) => batch.delete(docSnap.ref));
    await batch.commit();
  }
};

export const pauseUserAccount = async (
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      accountStatus: 'paused',
      pausedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, { operation: 'pauseUserAccount', userId });
    return { success: false, error: errorMessage };
  }
};

export const deleteUserAccountKeepRecipes = async (
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const publishedQuery = query(
      collection(db, 'PublishedRecipes'),
      where('authorId', '==', userId)
    );
    const publishedSnap = await getDocs(publishedQuery);

    const publishedDocs = publishedSnap.docs;
    for (let i = 0; i < publishedDocs.length; i += 450) {
      const batch = writeBatch(db);
      publishedDocs.slice(i, i + 450).forEach((docSnap) => {
        batch.update(docSnap.ref, {
          authorId: 'anonymous',
          authorDeletedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
    }

    await deleteCollection(collection(db, 'users', userId, 'FavRecipes'));
    await deleteCollection(collection(db, 'users', userId, 'Categories'));
    await deleteDoc(doc(db, 'users', userId));

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, { operation: 'deleteUserAccountKeepRecipes', userId });
    return { success: false, error: errorMessage };
  }
};
