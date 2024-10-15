import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAPvdd-pY24r5eeV9HZ_av0XJmAJ9HPHWY",
  authDomain: "chat-firebase-3ff5f.firebaseapp.com",
  databaseURL: "https://chat-firebase-3ff5f-default-rtdb.asia-southeast1.firebasedatabase.app",
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
const db = getFirestore(app);
const storage = getStorage(app);
// if (window.location.hostname === "localhost") {
//   connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
//   connectFirestoreEmulator(db, "localhost", 8080);
// }
export { app, analytics, auth, db, storage };
