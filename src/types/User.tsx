export interface User {
    isAdmin: boolean;
    firstName: string;
    lastName: string;
    middleName?: string;
    address: string;
    school: string;
    birthdate: Date;
    email: string;
    phone: number;
    guardian?: { 
        firstName: string,
        lastName: string,
        address: string,
        email: string,
        phone: number,
    }[];
    password: string; 
    swaligaId: number,
    id: string;
}