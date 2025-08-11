export interface Person {
  name: Name;
  gender: Gender;
  email: string;
  phone?: string;
}

export interface Name {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export function getFullName(name: Name): string {
  const { firstName, middleName, lastName } = name;
  return `${firstName} ${middleName ? `${middleName} ` : ""}${lastName}`
}

export interface User extends Person {
  uid: string;
  role: Role;
}

export interface Student extends User {
  id: string;
  role: "STUDENT";
  dateOfBirth: string; // ISO-8601
  joinedSwaligaDate: string; // ISO-8601
  ethnicity: Ethnicity[];
  guardians: Guardian[];
  address: Address;
  school: {
    name: string;
    address: Address;
    gradYear: number;
    gpa: number;
  }
}

export interface Admin extends User {
  role: "ADMIN";
}

export interface Guardian extends Person {
  relationship: GuardianRelationship;
}
export type GuardianRelationship =
  | "Father"
  | "Mother"
  | "Legal Guardian"
  | (string & {});
export const guardianRelationshipValues = ["Father", "Mother", "Legal Guardian", "Other"];

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: number;
}
export function getFullAddress(address: Address): string {
  const { addressLine1, addressLine2, city, state, country, zipCode } = address;
  return `${addressLine1}${addressLine2 ? `, ${addressLine2}` : ""}, ${city}, ${state}, ${country} ${zipCode}`;
}

export type Gender =
  | "Male"
  | "Female"
  | "Non-Binary"
  | (string & {});
export const genderValues = ["Male", "Female", "Non-Binary", "Other"];

export type Ethnicity =
  | "Black or African American"
  | "Indigenous"
  | "Asian"
  | "White"
  | "Multiracial"
  | "Latin"
  | (string & {});
export const ethnicityValues = [
  "Black or African American",
  "Indigenous",
  "Asian",
  "White",
  "Multiracial",
  "Latin",
  "Other"
]

export type Role = "ADMIN" | "STUDENT";