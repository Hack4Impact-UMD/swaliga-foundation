export interface User {
    isAdmin: boolean;
    firstName: string;
    lastName: string;
    middleName?: string;
    address: string;
    school: string;
    birthdate: string;
    email: string;
    phone: number;
    guardian?: {
        guardianFirstName: string,
        guardianLastName: string,
        guardianAddress: string,
        guardianEmail: string,
        guardianPhone: number,
    }[];
    password: string; 
    id: string;
}