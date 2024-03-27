import { createAccount } from "@/lib/firebase/database/users";
import { User } from "@/types/User";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        if (!req.body) {
            return NextResponse.json({ error: 'Missing Request Body' }, { status: 400 });
        }
        
        const data = await req.formData();
        const user : User = {
            isAdmin: (String(data.get('isAdmin')) === 'true') || false, 
            firstName: String(data.get('firstName')) || '', 
            lastName: String(data.get('lastName')) || '', 
            address: String(data.get('address')) || '', 
            school: String(data.get('school')) || '', 
            birthdate: new Date(String(data.get('birthdate'))) || Date(),
            email: String(data.get('email')) || '',
            phone: parseInt(String(data.get('phone'))) || 0, 
            password: String(data.get('password')) || '', 
            swaligaId: parseInt(String(data.get('swaligaId'))) || 0, 
            id: String(data.get('id')) || ''
        };
        
        if (checkIfValidUser(user)) {
            try {
                await createAccount(user);
                return NextResponse.json({ message: 'Account Created Successfully' }, { status: 200 });
            } catch {
                return NextResponse.json({ error: 'Error with Creating the Account' }, { status: 404 });
            }
        } else {
            return NextResponse.json({ error: 'Invalid User Data' }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to Load Data' }, { status: 500 });
    }
}

function checkIfValidUser(user : User) {
    return (user && user.firstName && user.lastName && user.address && user.school 
    && user.birthdate && user.email && user.phone && user.password && user.swaligaId && user.id);
}