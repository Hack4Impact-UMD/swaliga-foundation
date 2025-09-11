import { GoogleTokens } from "@/types/auth-types";
import { User } from "firebase/auth";
import moment from "moment";
import { AuthContextType } from "../authN/components/AuthProvider";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/config/firebaseConfig";

export async function getAccessToken(tokens: GoogleTokens, user: User, idToken: string): Promise<string> {
  if (tokens) {
    var { accessToken, expirationTime } = tokens;
    if (accessToken && expirationTime && moment().isBefore(moment(expirationTime))) {
      return accessToken;
    }
  }

  const newAccessToken = await httpsCallable(functions, 'refreshAccessToken')();
  await user.getIdTokenResult(true);
  return newAccessToken as unknown as string;
}

export async function getAccessTokenFromAuth(auth: AuthContextType) {
  if (!auth.user || !auth.token) throw new Error("No authenticated user found.");
  return getAccessToken(
    auth.token?.claims.googleTokens as GoogleTokens,
    auth.user,
    auth.token.token
  );
}