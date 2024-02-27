import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCDUKYEJgFYciOUYCLlsloEXqnK1X7Lkfg",
  authDomain: "swaliga-foundation.firebaseapp.com",
  projectId: "swaliga-foundation",
  storageBucket: "swaliga-foundation.appspot.com",
  messagingSenderId: "505888103104",
  appId: "1:505888103104:web:3395feb72787238ceaab25",
  measurementId: "G-BDTQT977Y3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };