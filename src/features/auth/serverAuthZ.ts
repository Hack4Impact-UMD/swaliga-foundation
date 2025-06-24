import { adminAuth } from "@/config/firebaseAdminConfig";
import { DecodedIdToken } from "firebase-admin/auth";

export async function isTokenAuthorized(idToken: string | undefined): Promise<DecodedIdToken | false> {
  if (!idToken) {
    return false;
  }
  let decodedToken: DecodedIdToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(idToken);
  } catch (error) {
    return false;
  }
  return decodedToken;
}