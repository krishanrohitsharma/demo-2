"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { isFirebaseConfigured, getFirebaseAuth, getGoogleProvider } from "@/lib/firebase";
import type { User } from "firebase/auth";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isFirebase: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  demoUser: { email: string; name: string } | null;
  demoLogin: (email: string, name: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoUser, setDemoUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      const stored = localStorage.getItem("wealthflow-demo-user");
      if (stored) {
        try { setDemoUser(JSON.parse(stored)); } catch {}
      }
      setLoading(false);
      return;
    }
    let unsubscribe: () => void;
    getFirebaseAuth().then((auth) => {
      import("firebase/auth").then(({ onAuthStateChanged }) => {
        unsubscribe = onAuthStateChanged(auth, (u) => {
          setUser(u);
          setLoading(false);
        });
      });
    });
    return () => unsubscribe?.();
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    const auth = await getFirebaseAuth();
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signupWithEmail = async (email: string, password: string, name: string) => {
    const auth = await getFirebaseAuth();
    const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) await updateProfile(cred.user, { displayName: name });
  };

  const loginWithGoogle = async () => {
    const auth = await getFirebaseAuth();
    const provider = await getGoogleProvider();
    const { signInWithPopup } = await import("firebase/auth");
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      const auth = await getFirebaseAuth();
      const { signOut } = await import("firebase/auth");
      await signOut(auth);
    } else {
      localStorage.removeItem("wealthflow-demo-user");
      setDemoUser(null);
    }
  };

  const resetPassword = async (email: string) => {
    const auth = await getFirebaseAuth();
    const { sendPasswordResetEmail } = await import("firebase/auth");
    await sendPasswordResetEmail(auth, email);
  };

  const demoLogin = (email: string, name: string) => {
    const u = { email, name };
    localStorage.setItem("wealthflow-demo-user", JSON.stringify(u));
    setDemoUser(u);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, isFirebase: isFirebaseConfigured,
      loginWithEmail, signupWithEmail, loginWithGoogle,
      logout, resetPassword, demoUser, demoLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useIsAuthenticated(): boolean {
  const { user, demoUser, isFirebase } = useAuth();
  return isFirebase ? !!user : !!demoUser;
}

export function useDisplayName(): string {
  const { user, demoUser, isFirebase } = useAuth();
  if (isFirebase) return user?.displayName || user?.email?.split("@")[0] || "User";
  return demoUser?.name || "User";
}

export function useUserEmail(): string {
  const { user, demoUser, isFirebase } = useAuth();
  if (isFirebase) return user?.email || "";
  return demoUser?.email || "";
}
