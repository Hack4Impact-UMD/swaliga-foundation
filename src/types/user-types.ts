export interface Person {
  name: {
    firstName: string;
    middleName?: string;
    lastName: string;
  };
  gender: "Male" | "Female" | "Non-Binary" | "Other";
  email: string;
  phone?: number;
}

export interface User {
  uid: string;
  role: Role;
}

export interface Student extends User {
  swaligaId: string;
  role: "STUDENT"
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
  relationship: "Father" | "Mother" | "Legal Guardian" | "Other";
}

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: number;
}

export enum Ethnicity {
  BlackOrAfricanAmerican = "Black or African American",
  Indigenous = "Indigenous",
  Asian = "Asian",
  White = "White",
  Multiracial = "Multiracial",
  Latin = "Latin",
}

export type Role = "ADMIN" | "STUDENT"; 