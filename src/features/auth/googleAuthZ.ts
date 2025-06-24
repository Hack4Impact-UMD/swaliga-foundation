import { GoogleTokens } from "@/types/auth-types";
import { User } from "firebase/auth";
import moment from "moment";

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