import {
  createUserWithEmailAndPassword,
  UserCredential,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { setDoc, doc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../firebaseConfig";
import { updateAccount } from "@/lib/firebase/database/users"; // Add this import

type UserAuthResponse = {
  success: boolean;
  userId: string | null;
};

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

    await updateProfile(user, { displayName: "STUDENT" });

    // Create the document in Firestore right after the user is created
    const userDoc = {
      isAdmin: false,
      firstName: '',  // Default values, update later
      middleName: '', // Default values, update later
      lastName: '',   // Default values, update later
      email: user.email,
      phone: 0,       // Default values, update later
      gender: '',     // Default values, update later
      birthdate: null,// Default values, update later
      guardian: [],   // Default values, update later
      id: userUid,
      address: {},
      school: '',
      gradYear: 0,
      yearsWithSwaliga: 0,
      swaligaID: 0,
      ethnicity: [],
      assignedSurveys: [],
      completedResponses: [],
    };

    await setDoc(doc(db, 'users', userUid), userDoc);

    return { success: true, userId: userUid };
  } catch (error) {
    console.log(error);
    return { success: false, userId: null };
  }
};


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
