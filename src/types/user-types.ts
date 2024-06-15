export interface User {
    isAdmin: boolean;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phone: number;
    gender: Gender;
    birthdate: Date;

    guardian?: { 
        name: string;
        email: string,
        phone: number,
        address: Address,
    }[];

    password: string; 
    confirmPassword: string;
    id: string;

    address: Address;
    school: string;
    gradYear: number;
    yearsWithSwaliga: number;
    ethnicity: RaceEthnicity;

    assignedSurveys: string[];
    completedResponses: string[];
}

interface Address {
    street: string;
    city: string;
    state: string;
    zip: number;
    country: string;
}

interface RaceEthnicity {
    blackOrAfricanAmerican: boolean;
    indigenous: boolean;
    asian: boolean;
    white: boolean;
    multiracial: boolean;
    latin: boolean;
    other: boolean;
    otherText: string;
}

type Gender = "Male" | "Female" | "Other"

export type { RaceEthnicity, Gender, Address }