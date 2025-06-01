import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "swaliga-foundation.firebaseapp.com",
  projectId: "swaliga-foundation",
  storageBucket: "swaliga-foundation.appspot.com",
  messagingSenderId: "505888103104",
  appId: "1:505888103104:web:d5dfb81b3d4d3e15eaab25",
  measurementId: "G-3EHC5DXCLL",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, "us-central1");

connectAuthEmulator(auth, 'http://localhost:9099');
connectFirestoreEmulator(db, 'localhost', 8080);
connectFunctionsEmulator(functions, "localhost", 5001);