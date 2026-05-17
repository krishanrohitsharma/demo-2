import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";

export const isFirebaseConfigured =
  typeof window !== "undefined" &&
  !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "demo" &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your-api-key-here";

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;

function getFirebaseApp(): FirebaseApp {
  if (_app) return _app;
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  _app = getApps().length ? getApps()[0] : initializeApp(config);
  return _app;
}

export async function getFirebaseAuth(): Promise<Auth> {
  if (_auth) return _auth;
  const { getAuth } = await import("firebase/auth");
  _auth = getAuth(getFirebaseApp());
  return _auth;
}

export async function getGoogleProvider() {
  const { GoogleAuthProvider } = await import("firebase/auth");
  return new GoogleAuthProvider();
}

export {
  type Auth,
};
