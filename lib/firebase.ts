import { FirebaseApp, initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export let app: FirebaseApp | null = null;

export const initFirebase = () => {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
};

// TRUE Lasy-loading: services are only pulled in when a component calls the getter.
// This removes the 400KB+ Firestore SDK from the initial site bundle.

let _auth: any = null;
let _db: any = null;
let _storage: any = null;
let _analytics: any = null;

export const getFirebaseAuth = async () => {
  if (!_auth) {
    const appInstance = initFirebase();
    const { getAuth } = await import('firebase/auth');
    _auth = getAuth(appInstance);
  }
  return _auth;
};

export const getFirestoreDb = async () => {
  if (!_db) {
    const appInstance = initFirebase();
    const { getFirestore } = await import('firebase/firestore');
    _db = getFirestore(appInstance);
  }
  return _db;
};

export const getFirebaseStorage = async () => {
  if (!_storage) {
    const appInstance = initFirebase();
    const { getStorage } = await import('firebase/storage');
    _storage = getStorage(appInstance);
  }
  return _storage;
};

export const getFirebaseAnalytics = async () => {
  if (typeof window === 'undefined') return null;
  if (!_analytics) {
    const appInstance = initFirebase();
    const { getAnalytics, isSupported } = await import('firebase/analytics');
    const supported = await isSupported();
    if (supported) {
      _analytics = getAnalytics(appInstance);
    }
  }
  return _analytics;
};

// DO NOT export constants 'db' or 'auth' here.
// Doing so forces the bundler to include the SDKs even if not used.
