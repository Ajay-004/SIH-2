// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// NOTE: Replace these placeholder values with your actual keys from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAizj7eoWq4hj0cghJh6-OBHztO03-yJD8",
  authDomain: "tour-c5b21.firebaseapp.com",
  projectId: "tour-c5b21",
  storageBucket: "tour-c5b21.firebasestorage.app",
  messagingSenderId: "51506921034",
  appId: "1:51506921034:web:fad0d0bf500617634330b3",
  measurementId: "G-NQXGHSFBYD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;