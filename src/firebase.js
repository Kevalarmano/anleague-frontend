// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword
} from "firebase/auth";

// ✅ Your actual Firebase config (from your Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCJPQDx8COLdzKZjvwUj3vPP7qE2XcqbL8",
  authDomain: "anleague-backend.firebaseapp.com",
  projectId: "anleague-backend",
  storageBucket: "anleague-backend.firebasestorage.app",
  messagingSenderId: "866726235387",
  appId: "1:866726235387:web:da094d0a0c5f8fe59cb45e"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

// ✅ Export helper functions (for easy importing in pages)
export {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  getDoc,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword
};
