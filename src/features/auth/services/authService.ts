import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/app/config/firebase';

interface ServiceResult<T> {
  success: boolean;
  user?: T;
  error?: string;
}

export const registerUser = async (
  email: string,
  password: string,
  username: string,
  fullName: string
): Promise<ServiceResult<User>> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await createUserDocument(user, username, fullName);

    return { success: true, user };
  } catch (error: unknown) {
    console.error('Error registering user:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const loginUser = async (email: string, password: string): Promise<ServiceResult<User>> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: unknown) {
    console.error('Error logging in:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const logoutUser = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: unknown) {
    console.error('Error logging out:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const createUserDocument = async (
  user: User | null,
  username: string,
  fullName: string
): Promise<void> => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      id: user.uid,
      username,
      name: fullName,
      email: user.email,
      createdAt: serverTimestamp(),
    });
  }
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
