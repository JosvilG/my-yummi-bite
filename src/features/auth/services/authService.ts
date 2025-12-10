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
import { captureException, addBreadcrumb } from '@/lib/sentry';
import { log } from '@/lib/logger';

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
    log.info('Registering new user', { email, username });
    
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await createUserDocument(user, username, fullName);
    
    log.info('User registered successfully', { userId: user.uid, email });
    return { success: true, user };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, {
      operation: 'registerUser',
      email,
      username,
    });
    return { success: false, error: errorMessage };
  }
};

export const loginUser = async (email: string, password: string): Promise<ServiceResult<User>> => {
  try {
    log.info('Login attempt', { email });
    
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    
    log.info('Login successful', { userId: userCredential.user.uid, email });
    return { success: true, user: userCredential.user };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log.error('Login failed', error, { email, operation: 'loginUser' });
    captureException(error as Error, {
      operation: 'loginUser',
      email,
    });
    return { success: false, error: errorMessage };
  }
};

export const logoutUser = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    log.info('Logging out user');
    await signOut(auth);
    log.info('User logged out successfully');
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log.error('Logout failed', error, { operation: 'logoutUser' });
    captureException(error as Error, {
      operation: 'logoutUser',
    });
    return { success: false, error: errorMessage };
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
