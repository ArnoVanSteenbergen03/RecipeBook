import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgXRWtMVebcDBKG9qsxZEk0gqCilklemM",
  authDomain: "recipebook-c4596.firebaseapp.com",
  projectId: "recipebook-c4596",
  storageBucket: "recipebook-c4596.firebasestorage.app",
  messagingSenderId: "1040728497603",
  appId: "1:1040728497603:web:14ef17a19dd83e5c723176",
  measurementId: "G-R0G42EXLCN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default app;
export { db };