import { auth } from '@/config/firebaseConfig';
import { AuthErrorCodes, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export async function signInWithGoogle(): Promise<void> {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (error: any) {
    const code = error.code;
    if (code !== AuthErrorCodes.POPUP_CLOSED_BY_USER && code !== AuthErrorCodes.EXPIRED_POPUP_REQUEST) {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
}

export async function logOut(): Promise<void> {
  try {
    auth.signOut();
  } catch (error: any) {
    throw new Error('An unexpected error occurred. Please try again later.')
  }
};