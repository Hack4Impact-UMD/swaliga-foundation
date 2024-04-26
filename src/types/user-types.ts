export interface User {
    isAdmin: boolean;
    firstName: string;
    lastName: string;
    middleName?: string;
    address: address;
    school: string;
    birthdate: Date;
    gradYear: number;
    email: string;
    phone: number;
    yearsWithSwaliga: number;
    ethnicity: Ethnicity;
    gender: Gender;
    guardian?: { 
        firstName: string,
        lastName: string,
        address: address,
        email: string,
        phone: number,
    }[];
    password: string; 
    id: string;
    assignedSurveys: string[];
    completedResponses: string[];
}

interface address {
    street: string;
    city: string;
    state: string;
    zip: number;
    country: string;
}

type Ethnicity = "Black or African American" | "Indigenous" | "Asian" | "White" | "Multiracial" | "LatinX/Latina/Latino/Latine" | OtherEthnicity
type Gender = "Male" | "Female" | "Other"
type OtherEthnicity = string