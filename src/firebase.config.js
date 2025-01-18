// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { gerFirestore, getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBetQJ0ZBlu9MxoMzlJLlyZdLtm5g69-Zc",
  authDomain: "house-marketplace-app-a9c04.firebaseapp.com",
  projectId: "house-marketplace-app-a9c04",
  storageBucket: "house-marketplace-app-a9c04.firebasestorage.app",
  messagingSenderId: "209037625698",
  appId: "1:209037625698:web:cc4de7407bb2869c0a443b"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();