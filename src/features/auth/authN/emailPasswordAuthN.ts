import { createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthErrorCodes, sendEmailVerification, User, sendPasswordResetEmail, confirmPasswordReset, validatePassword, checkActionCode, applyActionCode } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";

export async function signUpUser(email: string, password: string): Promise<void> {
  await checkPasswordValidity(password);
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    const code = error.code;
    switch (code) {
      case AuthErrorCodes.EMAIL_EXISTS:
        throw new Error("Email already exists. Please log in or reset your password instead.");
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
        throw new Error("User not found. Please sign up.");
      case AuthErrorCodes.USER_DISABLED:
        throw new Error("User account is disabled. If you think this is a mistake, please contact website administrators.");
      case AuthErrorCodes.INVALID_PASSWORD:
      case "auth/missing-password":
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
    const code = error.code;
    switch (code) {
      case AuthErrorCodes.USER_DELETED:
        throw new Error("User not found. Please sign up.");
      default:
        throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
}

export async function resetPassword(oobCode: string, newPassword: string): Promise<void> {
  await checkPasswordValidity(newPassword);
  try {
    await confirmPasswordReset(auth, oobCode, newPassword);
  } catch (error: any) {
    const code = error.code;
    switch (code) {
      case AuthErrorCodes.INVALID_OOB_CODE:
      case AuthErrorCodes.EXPIRED_OOB_CODE:
        throw new Error("Reset password is invalid or expired. Please request a new password reset link.");
      case AuthErrorCodes.USER_DELETED:
        throw new Error("User not found. Please sign up.");
      case AuthErrorCodes.USER_DISABLED:
        throw new Error("User account is disabled. If you think this is a mistake, please contact website administrators.");
      case AuthErrorCodes.WEAK_PASSWORD:
        throw new Error("Weak password. Please enter a stronger password.");
      default:
        throw new Error("An unexpected error occurred. Please try again.")
    }
  }
}

async function checkPasswordValidity(password: string): Promise<void> {
  // Skip validation when not in prod environment since Firebase Auth Emulator does not support password validation
  if (process.env.NODE_ENV !== "production") { return; }
  let validation;
  try {
    validation = await validatePassword(auth, password);
  } catch (error: any) {
    throw new Error("An unexpected error occurred. Please try again later.")
  }
  if (validation.isValid) {
    return;
  } else if (!validation.meetsMinPasswordLength) {
    throw new Error(
      "Password is too short. It must be at least 6 characters."
    );
  } else if (!validation.meetsMaxPasswordLength) {
    throw new Error(
      "Password is too long. It must be no more than 4096 characters."
    );
  }
}

export async function checkCodeValidity(oobCode: string): Promise<void> {
  try {
    await checkActionCode(auth, oobCode);
  } catch (error: any) {
    const code = error.code;
    switch (code) {
      case AuthErrorCodes.INVALID_OOB_CODE:
      case AuthErrorCodes.EXPIRED_OOB_CODE:
        throw new Error("The action code is invalid or has expired. Please request a new link.");
      case AuthErrorCodes.USER_DELETED:
        throw new Error("User not found. Please sign up.");
      case AuthErrorCodes.USER_DISABLED:
        throw new Error("User account is disabled. If you think this is a mistake, please contact website administrators.");
      default:
        throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
}

export async function verifyEmail(oobCode: string): Promise<void> {
  try {
    console.log("Verifying email with code:", oobCode);
    await applyActionCode(auth, oobCode);
    console.log("Email verification successful.");
  } catch (error: any) {
    const code = error.code;
    console.log(code)
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