import { adminAuth } from "@/config/firebaseAdminConfig";
import { DecodedIdTokenWithCustomClaims } from "@/types/auth-types";

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

export async function isIpAddressValid(ipAddress: string, version: 4 | 6): Promise<boolean> {
  const response = await fetch('');
  if (!response.ok) {
    throw new Error("Failed to fetch valid IP addresses")
  }
  return true;
}