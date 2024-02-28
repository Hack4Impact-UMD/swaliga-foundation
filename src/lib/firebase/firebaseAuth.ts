import {
  createUserWithEmailAndPassword,
  UserCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebaseConfig";

type userAuthResponse = {
  success: boolean;
  userId: string | null;
};

export const signUpUser = async (
  email: string,
  password: string
): Promise<userAuthResponse> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
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

export const loginUser = async (
  email: string,
  password: string
): Promise<userAuthResponse> => {
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
