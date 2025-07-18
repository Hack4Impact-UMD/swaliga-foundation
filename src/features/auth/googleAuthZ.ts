import { GoogleTokens } from "@/types/auth-types";
import { User } from "firebase/auth";
import moment from "moment";
import { AuthContextType } from "./AuthProvider";

export async function getAccessToken(tokens: GoogleTokens, user: User, idToken: string): Promise<string> {
  const { accessToken, expirationTime } = tokens;
  if (moment().isBefore(moment(expirationTime))) {
    return accessToken;
  }
  const response = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/token`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${idToken}`,
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    }
  });
  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }
  await user.getIdTokenResult(true);
  const newAccessToken = await response.json();
  return newAccessToken;
}

export async function getAccessTokenFromAuth(auth: AuthContextType) {
  return getAccessToken(
    auth.token?.claims.googleTokens as GoogleTokens,
    auth.user!,
    auth.token!.token
  );
}