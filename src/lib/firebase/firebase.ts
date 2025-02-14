'use client';

// Import Firebase modules
import { initializeApp, getApps, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { 
  getFirestore, 
  enableIndexedDbPersistence,
  Firestore 
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

try {
  // Check if we're in the browser and if Firebase is already initialized
  if (typeof window !== 'undefined') {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
      console.log('Firebase app initialized');
    } else {
      app = getApps()[0];
      console.log('Using existing Firebase app');
    }

    // Initialize services
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);

    // Enable offline persistence for Firestore
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support persistence.');
      }
    });

    // Log successful initialization
    console.log('Firebase services initialized successfully');
    console.log('Project ID:', firebaseConfig.projectId);
    console.log('Auth Domain:', firebaseConfig.authDomain);
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  // Don't throw the error, just log it
  if (typeof window !== 'undefined') {
    console.warn('Firebase initialization failed. Some features may not work.');
  }
}

// Export initialized services with fallbacks for SSR
export const getFirebaseApp = () => {
  if (typeof window === 'undefined') return null;
  return app;
};

export const getFirebaseAuth = () => {
  if (typeof window === 'undefined') return null;
  return auth;
};

export const getFirebaseDb = () => {
  if (typeof window === 'undefined') return null;
  return db;
};

export const getFirebaseStorage = () => {
  if (typeof window === 'undefined') return null;
  return storage;
};

// For backward compatibility
export { db, auth, storage };
