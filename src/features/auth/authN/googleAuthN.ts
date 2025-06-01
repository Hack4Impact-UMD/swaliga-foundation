import { auth } from '@/config/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, UserCredential } from 'firebase/auth';

export async function signInWithGoogle(): Promise<UserCredential | void> {
  try {
    return (await signInWithPopup(auth, new GoogleAuthProvider()));
  } catch (error: any) {
    if (!error.message.includes("auth/popup-closed-by-user") && !error.message.includes("auth/cancelled-popup-request")) {
      throw new Error(error.message)
    }
  }
}

export async function logOut(): Promise<void> {
  const user = auth.currentUser;
  if (user) {
    await auth.signOut();
  }
};