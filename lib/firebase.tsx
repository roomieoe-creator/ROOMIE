// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBak6B01jPTDXJDeiNZOUjiHfvkD47HgBU",
  authDomain: "roomie-9b024.firebaseapp.com",
  databaseURL: "https://roomie-9b024-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "roomie-9b024",
  storageBucket: "roomie-9b024.firebasestorage.app",
  messagingSenderId: "1078424932610",
  appId: "1:1078424932610:web:11f57aea8a6bbf9d98f21b",
  measurementId: "G-F49Q6RK2SR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // for login/signup
export const db = getFirestore(app); // for the users / posts/ groups / messages
export const storage = getStorage(app); // for the images