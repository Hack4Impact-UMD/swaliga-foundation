import {
  createUserWithEmailAndPassword,
  UserCredential,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../config/firebaseConfig";

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
    console.error("unable to sign up");
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
    console.error("unable to log in");
    return { success: false, userId: null };
  }
};
