import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth,
  getReactNativePersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getDatabase, 
  ref, 
  set, 
  get, 
  push, 
  update, 
  remove, 
  onValue,
  off 
} from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Your Firebase configuration - EXACT copy from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAE-TNpqnHeepa13Ouhs04JJd0oOT8nWxY",
  authDomain: "tripnest-83101.firebaseapp.com",
  databaseURL: "https://tripnest-83101-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tripnest-83101",
  storageBucket: "tripnest-83101.firebasestorage.app",
  messagingSenderId: "938812065684",
  appId: "1:938812065684:web:20883d2f408fab64217181",
  measurementId: "G-CYKDRQ7L6S"
};

// Initialize Firebase (prevent duplicate initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with persistence
let auth;
try {
  if (Platform.OS === 'web') {
    auth = getAuth(app);
  } else {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
} catch (error) {
  auth = getAuth(app);
}

// Initialize Realtime Database
const database = getDatabase(app);

export { 
  auth, 
  database,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  // Database exports
  ref,
  set,
  get,
  push,
  update,
  remove,
  onValue,
  off
};

export default app;
