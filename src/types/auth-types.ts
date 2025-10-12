import { IdTokenResult } from "firebase/auth";
import { Role } from "./user-types";

export interface CustomClaims {
  role?: Role,
}

export interface StudentCustomClaims extends CustomClaims {
  role?: "STUDENT";
  studentId?: string;
}
export interface StaffCustomClaims extends CustomClaims { role: "STAFF" }
export interface AdminCustomClaims extends CustomClaims { role: "ADMIN" }

export type StudentDecodedIdTokenWithCustomClaims = IdTokenResult & StudentCustomClaims;
export type StaffDecodedIdTokenWithCustomClaims = IdTokenResult & StaffCustomClaims;
export type AdminDecodedIdTokenWithCustomClaims = IdTokenResult & AdminCustomClaims;
export type DecodedIdTokenWithCustomClaims = StudentDecodedIdTokenWithCustomClaims | StaffDecodedIdTokenWithCustomClaims | AdminDecodedIdTokenWithCustomClaims;