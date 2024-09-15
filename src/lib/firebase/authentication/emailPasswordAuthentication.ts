import {
  createUserWithEmailAndPassword,
  UserCredential,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { setDoc, doc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../firebaseConfig";

type UserAuthResponse = {
  success: boolean;
  userId: string | null;
};

// Function to sign up a user and create a Firestore document for the user
export const signUpUser = async (
  email: string,
  password: string
): Promise<UserAuthResponse> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    const userUid = user?.uid;

    if (!userUid) {
      throw new Error("Failed to sign up user: UID is null or undefined.");
    }

    // Create the user document in Firestore with default values
    const userDoc = {
      isAdmin: false,
      firstName: "",  // Default values, update later
      middleName: "", // Default values, update later
      lastName: "",   // Default values, update later
      email: user.email,
      phone: 0,       // Default values, update later
      gender: "",     // Default values, update later
      birthdate: null, // Default values, update later
      guardian: [],   // Default values, update later
      id: userUid,
      address: {
        street: "",
        city: "",
        state: "",
        zip: 0,
        country: "",
      },
      school: "",
      gradYear: 0,
      yearsWithSwaliga: 0,
      swaligaID: 0,
      ethnicity: [], 
      assignedSurveys: [],
      completedResponses: [],
    };

    await setDoc(doc(db, 'users', userUid), userDoc);
    await fetch("/api/auth/claims/registering", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uid: user.uid })
    });
    await auth.currentUser?.getIdToken(true);
    return { success: true, userId: userUid };
  } catch (error) {
    console.log(error);
    return { success: false, userId: null };
  }
};

// Function to log in a user with email and password
export const loginUser = async (
  email: string,
  password: string
): Promise<UserAuthResponse> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    return { success: true, userId: user.uid };
  } catch (error) {
    console.log(error);
    return { success: false, userId: null };
  }
};
