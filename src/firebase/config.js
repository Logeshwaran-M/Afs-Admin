// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9XW56t6ca89GlQT7F2YMZHANtdyxQe-8",
  authDomain: "atsecommerce-84084.firebaseapp.com",
  projectId: "atsecommerce-84084",
  storageBucket: "atsecommerce-84084.firebasestorage.app",
  messagingSenderId: "876171359780",
  appId: "1:876171359780:web:b4119d162174257879cab1",
  measurementId: "G-VQ75542VJX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;