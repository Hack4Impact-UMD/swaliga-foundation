import { adminAuth } from "@/config/firebaseAdminConfig";
import { DecodedIdTokenWithCustomClaims } from "@/types/auth-types";
import { Address4, Address6 } from 'ip-address';

export async function isIdTokenValid(idToken: string | undefined | null): Promise<DecodedIdTokenWithCustomClaims | false> {
  if (!idToken) {
    return false;
  }
  let decodedToken: DecodedIdTokenWithCustomClaims;
  try {
    decodedToken = await adminAuth.verifyIdToken(idToken);
  } catch (error) {
    return false;
  }
  return decodedToken;
}