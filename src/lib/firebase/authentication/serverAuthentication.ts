import { adminAuth } from "../firebaseAdminConfig";

export async function isUserAdmin(idToken: string): Promise<boolean> {
  try {
    const idTokenResult = await adminAuth.verifyIdToken(idToken);
    return idTokenResult.role === "ADMIN";
  } catch (err) {
    return false;
  }
}