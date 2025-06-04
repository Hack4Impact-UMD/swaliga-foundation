import { createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthErrorCodes, sendEmailVerification, User, sendPasswordResetEmail, confirmPasswordReset } from "firebase/auth";
import { auth } from "../../../config/firebaseConfig";

export async function signUpUser(email: string, password: string): Promise<void> {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    const code = error.code;
    switch (code) {
      case AuthErrorCodes.EMAIL_EXISTS:
        throw new Error("Email already exists. Please log in instead.");
      case AuthErrorCodes.INVALID_EMAIL:
        throw new Error("Invalid email address. Please enter a valid email.");
      case AuthErrorCodes.WEAK_PASSWORD:
        throw new Error("Weak password. Please enter a stronger password.");
      default:
        throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
};

export async function loginUser(email: string, password: string): Promise<void> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    const code = error.code;
    switch (code) {
      case AuthErrorCodes.INVALID_EMAIL:
        throw new Error("Invalid email address. Please enter a valid email.");
      case AuthErrorCodes.USER_DELETED:
        throw new Error("User not found. Please sign up first.");
      case AuthErrorCodes.USER_DISABLED:
        throw new Error("User account is disabled. If you think this is a mistake, please contact website administrators.");
      case AuthErrorCodes.INVALID_PASSWORD:
        throw new Error("Invalid password. Please try again.")
      default:
        throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};

export async function sendVerificationEmail(user: User): Promise<void> {
  try {
    await sendEmailVerification(user);
  } catch (error: any) {
    throw new Error("Failed to send verification email. Please try again later.")
  }
}

export async function sendResetPasswordEmail(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error("Failed to send password reset email. Please try again later.")
  }
}

export async function resetPassword(oobCode: string, newPassword: string): Promise<void> {
  try {
    confirmPasswordReset(auth, oobCode, newPassword);
  } catch (error: any) {
    const code = error.code;
    switch (code) {
      case AuthErrorCodes.INVALID_OOB_CODE:
      case AuthErrorCodes.EXPIRED_OOB_CODE:
        throw new Error("Reset password is invalid or expired. Please request a new password reset link.");
      case AuthErrorCodes.USER_DELETED:
        throw new Error("User not found. Please sign up first.");
      case AuthErrorCodes.USER_DISABLED:
        throw new Error("User account is disabled. If you think this is a mistake, please contact website administrators.");
      case AuthErrorCodes.WEAK_PASSWORD:
        throw new Error("Weak password. Please enter a stronger password.");
      default:
        throw new Error("An unexpected error occurred. Please try again.")
    }
  }
}