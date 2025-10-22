// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";

//  Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJPQDx8COLdzKZjvwUj3vPP7qE2XcqbL8",
  authDomain: "anleague-backend.firebaseapp.com",
  projectId: "anleague-backend",
  storageBucket: "anleague-backend.appspot.com",
  messagingSenderId: "866726235387",
  appId: "1:866726235387:web:da094d0a0c5f8fe59cb45e",
};

//  Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

// Export everything you need in one clean block
export {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  orderBy,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
};
