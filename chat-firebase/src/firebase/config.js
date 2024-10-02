import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPvdd-pY24r5eeV9HZ_av0XJmAJ9HPHWY",
  authDomain: "chat-firebase-3ff5f.firebaseapp.com",
  projectId: "chat-firebase-3ff5f",
  storageBucket: "chat-firebase-3ff5f.appspot.com",
  messagingSenderId: "259020206408",
  appId: "1:259020206408:web:f93a89c8df57dd9576037d",
  measurementId: "G-L57Q14W58D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
export { app, analytics, auth, firestore };