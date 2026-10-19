import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';

import { auth, isFirebaseConfigured, requireAuth } from '../lib/firebase';
import { describeAuthError } from '../lib/authErrors';
import { registerForPushNotificationsAsync } from '../lib/notifications';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

function cleanError(error: unknown): string {
  return describeAuthError(error);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Sans configuration Firebase, il n'y a aucune session à attendre : on démarre
  // directement « chargé », ce qui évite de corriger l'état dans un effet.
  const [loading, setLoading] = useState(() => Boolean(isFirebaseConfigured && auth));

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;
    return onAuthStateChanged(auth, (next) => {
      setUser(next);
      setLoading(false);
      if (next) {
        registerForPushNotificationsAsync(next.uid).catch(() => {});
      }
    });
  }, []);

  async function login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(requireAuth(), email.trim(), password);
    } catch (error) {
      throw new Error(cleanError(error));
    }
  }

  async function register(email: string, password: string, displayName: string) {
    try {
      const credential = await createUserWithEmailAndPassword(
        requireAuth(),
        email.trim(),
        password,
      );
      if (displayName.trim()) {
        await updateProfile(credential.user, { displayName: displayName.trim() });
        setUser({ ...credential.user });
      }
    } catch (error) {
      throw new Error(cleanError(error));
    }
  }

  async function logout() {
    await signOut(requireAuth());
  }

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
