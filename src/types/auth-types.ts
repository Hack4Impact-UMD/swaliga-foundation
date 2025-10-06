import { DecodedIdToken } from "firebase-admin/auth";
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

export type StudentDecodedIdTokenWithCustomClaims = DecodedIdToken & StudentCustomClaims;
export type StaffDecodedIdTokenWithCustomClaims = DecodedIdToken & StaffCustomClaims;
export type AdminDecodedIdTokenWithCustomClaims = DecodedIdToken & AdminCustomClaims;
export type DecodedIdTokenWithCustomClaims = StudentDecodedIdTokenWithCustomClaims | StaffDecodedIdTokenWithCustomClaims | AdminDecodedIdTokenWithCustomClaims;