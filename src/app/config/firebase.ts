import type { FirebaseApp } from 'firebase/app';
import type { Auth, User } from 'firebase/auth';
import { getFirestore, serverTimestamp, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { log } from '@/lib/logger';

const firebaseAppModule = require('firebase/app') as typeof import('firebase/app');
const firebaseAuthModule = require('firebase/auth') as typeof import('firebase/auth');

const firebaseConfig = {
  apiKey:
    Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_API_KEY ||
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain:
    Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:
    Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:
    Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:
    Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_APP_ID ||
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId:
    Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ||
    process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app: FirebaseApp = firebaseAppModule.getApps().length ? firebaseAppModule.getApp() : firebaseAppModule.initializeApp(firebaseConfig);

const createNativeAuth = (firebaseApp: FirebaseApp): Auth => {
  try {
    const getReactNativePersistence = (firebaseAuthModule as any).getReactNativePersistence as
      | ((storage: typeof AsyncStorage) => unknown)
      | undefined;
    if (typeof getReactNativePersistence !== 'function') {
      throw new Error('getReactNativePersistence is not available in this Firebase Auth build');
    }
    return firebaseAuthModule.initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage) as any,
    });
  } catch (error) {
    log.warn('Falling back to default auth persistence', {
      error: error instanceof Error ? error.message : String(error),
    });
    return firebaseAuthModule.getAuth(firebaseApp);
  }
};

const auth: Auth = Platform.OS === 'web' ? firebaseAuthModule.getAuth(app) : createNativeAuth(app);

const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage, serverTimestamp };
export type { Auth, User };
