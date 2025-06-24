import { DecodedIdToken } from "firebase-admin/auth";
import { Role } from "./user-types";

export type GoogleTokens = {
  refreshToken: string;
  accessToken: string;
  expirationTime: string; // ISO-8601
}

export type AuthCustomClaims = {
  role?: Role;
  googleTokens?: GoogleTokens;
}

export type DecodedIdTokenWithCustomClaims = DecodedIdToken & AuthCustomClaims;