import {
  createUserWithEmailAndPassword,
  UserCredential,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
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
    
    //await updateProfile(user, { displayName: "STUDENT" });

    //await updateAccount(user.uid, { isAdmin: false });

    await fetch("/api/auth/user/claims", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uid: user.uid })
    });

    await auth.currentUser?.getIdToken(true);

    return { success: true, userId: user.uid };
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
