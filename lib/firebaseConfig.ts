import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYaecHr1dROaew2PGOZZWkPzTHK5Ft0I",
  authDomain: "smartchef-ai-9fe5d.firebaseapp.com",
  projectId: "smartchef-ai-9fe5d",
  storageBucket: "smartchef-ai-9fe5d.firebasestorage.app",
  messagingSenderId: "909517470351",
  appId: "1:909517470351:web:3ede8c1749a6621dcdcefa",
  measurementId: "G-14P0QS551R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
