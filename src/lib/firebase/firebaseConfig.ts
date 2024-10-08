import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  authDomain: "swaliga-foundation.firebaseapp.com",
  projectId: "swaliga-foundation",
  storageBucket: "swaliga-foundation.appspot.com",
  messagingSenderId: "505888103104",
  appId: "1:505888103104:web:d5dfb81b3d4d3e15eaab25",
  measurementId: "G-3EHC5DXCLL",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
