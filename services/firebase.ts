// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgraRLE4yottwC1hOa8gteO7DTfNb5Y_E",
  authDomain: "ahan-hub.firebaseapp.com",
  projectId: "ahan-hub",
  storageBucket: "ahan-hub.appspot.com",
  messagingSenderId: "756412110549",
  appId: "1:756412110549:web:f7228e745e5fab4e0ef45c",
  measurementId: "G-M1E7JLWWBQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
