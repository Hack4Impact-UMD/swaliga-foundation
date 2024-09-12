import { Role } from "@/types/user-types";
import { adminAuth } from "../firebaseAdminConfig";

export async function isUserAdmin(idToken: string): Promise<boolean> {
  try {
    const idTokenResult = await adminAuth.verifyIdToken(idToken);
    return idTokenResult.role === Role.ADMIN;
  } catch (err) {
    return false;
  }
}