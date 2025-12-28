import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyA9_1tGbAOzlU6WM0hqof5oSwfYis8K4f4",
    authDomain: "koc-management.firebaseapp.com",
    projectId: "koc-management",
    storageBucket: "koc-management.firebasestorage.app",
    messagingSenderId: "647635907150",
    appId: "1:647635907150:web:29cb343854fe75ece8091f",
    measurementId: "G-RJ7C90VP9R"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
