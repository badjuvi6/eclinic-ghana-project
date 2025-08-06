// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add your web app's Firebase configuration here
// IMPORTANT: Replace this with the actual config object from your Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyAi-N9sOr2-ymZ9qROSGcK5aNuPan_CaqQ",
  authDomain: "eclinic-ghana-project-c9747.firebaseapp.com",
  projectId: "eclinic-ghana-project-c9747",
  storageBucket: "eclinic-ghana-project-c9747.firebasestorage.app",
  messagingSenderId: "848469102189",
  appId: "1:848469102189:web:9e5b22998ae7b8859af964"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services to be used in other parts of the app
export const auth = getAuth(app);
export const db = getFirestore(app);