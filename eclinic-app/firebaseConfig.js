import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCGlfDF5Mbf9PfI8AyqWXFQiWSjpT0rdNw",
  authDomain: "eclinic-ghana-project-c9747.firebaseapp.com", 
  projectId: "eclinic-ghana-project-c9747",
  storageBucket: "eclinic-ghana-project-c9747.firebasestorage.app",
  messagingSenderId: "848469102189",
  appId: "1:848469102189:android:58d8b0e615e71b6e9af964"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);