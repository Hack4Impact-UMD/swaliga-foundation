import { auth } from "@/config/firebaseConfig";
import { applyActionCode, AuthErrorCodes, EmailAuthProvider, GoogleAuthProvider, linkWithCredential, verifyBeforeUpdateEmail } from "firebase/auth";

export async function linkEmailPasswordAccount(newEmail: string, newPassword: string, isNewEmailPrimary = true) {
  try {
    if (!auth.currentUser) throw new Error("No authenticated user found.");
    const credential = EmailAuthProvider.credential(newEmail, newPassword);
    await linkWithCredential(auth.currentUser, credential);
  } catch (error) {
    const code = (error as any).code;
    switch (code) {
      case AuthErrorCodes.INVALID_EMAIL:
        throw new Error("Please enter a valid email.");

    }
  }
}

export async function linkGoogleAccount(newEmail: string, isNewEmailPrimary = true) {
  try {
    if (!auth.currentUser) throw new Error("No authenticated user found.");
    const credential = GoogleAuthProvider.credential();
    await linkWithCredential(auth.currentUser, credential);
  } catch (error) {
    const code = (error as any).code;
    switch (code) {
      case AuthErrorCodes.INVALID_EMAIL:
        throw new Error("Please enter a valid email.");
    }
  }
}


export async function sendChangeEmailLink(newEmail: string) {
  try {
    if (!auth.currentUser) throw new Error("No authenticated user found.");
    await verifyBeforeUpdateEmail(auth.currentUser, newEmail);
  } catch (error) {
    const code = (error as any).code;
    switch (code) {
      case 'auth/invalid-new-email':
        throw new Error("The new email address is invalid. Please enter a valid email.");
      case 'auth/requires-recent-login':
        throw new Error("For security reasons, please log out and log back in before changing your email.");
      default:
        throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
}

export async function applyOobCode(oobCode: string): Promise<void> {
  try {
    await applyActionCode(auth, oobCode);
  } catch (error: any) {
    const code = error.code;
    switch (code) {
      case AuthErrorCodes.INVALID_OOB_CODE:
      case AuthErrorCodes.EXPIRED_OOB_CODE:
        throw new Error("The verification code is invalid or has expired. Please request a new verification link.");
      case AuthErrorCodes.USER_DELETED:
        throw new Error("User not found. Please sign up.");
      case AuthErrorCodes.USER_DISABLED:
        throw new Error("User account is disabled. If you think this is a mistake, please contact website administrators.");
      default:
        throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
}