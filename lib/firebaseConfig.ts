import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYaecHr1dROaew2PGOZZwKkPzTHK5Ft0I",
  authDomain: "smartchef-ai-9fe5d.firebaseapp.com",
  databaseURL: "https://smartchef-ai-9fe5d-default-rtdb.firebaseio.com",
  projectId: "smartchef-ai-9fe5d",
  storageBucket: "smartchef-ai-9fe5d.firebasestorage.app",
  messagingSenderId: "909517470351",
  appId: "1:909517470351:web:3ede8c1749a6621dcdcefa",
  measurementId: "G-14P0QS551R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Auth and Firestore
// Note: Analytics is disabled as it requires a DOM environment not present in React Native
export const auth = getAuth(app);
export const db = getFirestore(app);

export { app };
