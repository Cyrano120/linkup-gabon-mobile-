import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import { getAuth, initializeAuth, type Auth, type Persistence } from 'firebase/auth';
import { getFirestore, initializeFirestore, type Firestore } from 'firebase/firestore';

interface AsyncStorageLike {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

/**
 * `getReactNativePersistence` n'est exposé que par la condition d'export
 * « react-native », résolue par Metro au bundling. Les types web de
 * `firebase/auth` ne le déclarent pas : on récupère donc la fonction avec un
 * cast typé, sans casser le typage du reste de l'app.
 */
const getReactNativePersistence = (
  firebaseAuth as unknown as {
    getReactNativePersistence: (storage: AsyncStorageLike) => Persistence;
  }
).getReactNativePersistence;

export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
};

export const easProjectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID ?? '';

/** Vrai si les variables d'environnement Firebase sont renseignées. */
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

if (isFirebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);

  try {
    // Persistance de session via AsyncStorage (React Native).
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // initializeAuth jette si déjà initialisé (Fast Refresh).
    authInstance = getAuth(app);
  }

  try {
    // Long polling : contourne les limitations de streaming réseau sur RN.
    dbInstance = initializeFirestore(app, { experimentalForceLongPolling: true });
  } catch {
    dbInstance = getFirestore(app);
  }
}

export const auth = authInstance;
export const db = dbInstance;

export function requireAuth(): Auth {
  if (!authInstance) throw new Error('Firebase Auth non configuré. Renseigne le fichier .env.');
  return authInstance;
}

export function requireDb(): Firestore {
  if (!dbInstance) throw new Error('Firestore non configuré. Renseigne le fichier .env.');
  return dbInstance;
}
