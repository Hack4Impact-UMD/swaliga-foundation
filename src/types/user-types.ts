import { Timestamp } from "firebase/firestore";

export interface User {
  isAdmin: boolean;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: number;
  gender: Gender;
  birthdate: Timestamp;

  guardian?: {
    name: string;
    email: string;
    phone: number;
    address: Address;
  }[];

  password: string;
  confirmPassword: string;
  id: string;

  address: Address;
  school: string;
  gradYear: number;
  yearsWithSwaliga: number;
  ethnicity: Set<Ethnicity | string>;

  assignedSurveys: string[];
  completedResponses: string[];
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zip: number;
    country: string;
}

export enum Ethnicity {
    BlackOrAfricanAmerican = "Black or African American",
    Indigenous = "Indigenous",
    Asian = "Asian",
    White = "White",
    Multiracial = "Multiracial",
    Latin = "Latin",
}

export enum Gender {
    Male = "Male",
    Female = "Female",
    NonBinary = "Non-Binary",
    Other = "Other"
}