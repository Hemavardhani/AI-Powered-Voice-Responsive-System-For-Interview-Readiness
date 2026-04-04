// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXkFulEf6Rm7uxhhA0coSFjEJfAodOj7s",
  authDomain: "aivoiceagent-355a3.firebaseapp.com",
  projectId: "aivoiceagent-355a3",
  storageBucket: "aivoiceagent-355a3.firebasestorage.app",
  messagingSenderId: "717204159330",
  appId: "1:717204159330:web:4623426c8c94918438ca3b",
  //   measurementId: "G-18T44JS8YE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
