import { DecodedIdToken } from "firebase-admin/auth";
import { Role } from "./user-types";

export interface CustomClaims {
  role?: Role,
}

export interface StudentCustomClaims extends CustomClaims {
  role?: "STUDENT";
  studentId?: string;
}

export interface StaffCustomClaims extends CustomClaims {
  role?: "STAFF";
  googleTokens?: Omit<GoogleTokens, 'refreshToken'>;
}

export interface AdminCustomClaims extends CustomClaims {
  role?: "ADMIN";
  googleTokens?: GoogleTokens;
}

export type GoogleTokens = {
  refreshToken: string;
  accessToken: string;
  expirationTime: string; // ISO-8601
}

export type StudentDecodedIdTokenWithCustomClaims = DecodedIdToken & StudentCustomClaims;
export type StaffDecodedIdTokenWithCustomClaims = DecodedIdToken & StaffCustomClaims;
export type AdminDecodedIdTokenWithCustomClaims = DecodedIdToken & AdminCustomClaims;
export type DecodedIdTokenWithCustomClaims = StudentDecodedIdTokenWithCustomClaims | StaffDecodedIdTokenWithCustomClaims | AdminDecodedIdTokenWithCustomClaims;