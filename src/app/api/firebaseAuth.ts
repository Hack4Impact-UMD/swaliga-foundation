import {
  getAuth,
  createUserWithEmailAndPassword,
  UserCredential,
  AuthError,
  signInWithEmailAndPassword,
} from "firebase/auth";
import auth from "../lib/firebase/firebaseConfig";

type userAuthResponse = {
  success: boolean;
  userId: number;
};

export const signUpUser = (
  email: string,
  password: string
): userAuthResponse => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential: UserCredential) => {
      const user = userCredential.user;
      return { success: true, userId: user.uid };
    })
    .catch((error: AuthError) => {
      console.log(error.message);
      return { success: false, userId: -1 };
    });

  return { success: false, userId: -1 };
};

export const loginUser = (
  email: string,
  password: string
): userAuthResponse => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential: UserCredential) => {
      const user = userCredential.user;
      return { success: true, userId: user.uid };
    })
    .catch((error: AuthError) => {
      console.log(error.message);
      return { success: false, userId: -1 };
    });

  return { success: false, userId: -1 };
};
