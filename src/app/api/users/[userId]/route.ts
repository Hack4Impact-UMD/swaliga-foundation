import { getAccountById, updateAccount } from "@/lib/firebase/database/users";
import { User } from "@/types/user-types";
import { NextRequest, NextResponse } from 'next/server';
import { UpdateData } from "firebase/firestore";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    const userid = params.userId;

    try {
        const result = await getAccountById(userid);
        return NextResponse.json({ result }, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Error with Getting the Account Via the Given ID' }, { status: 404 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { userId: string }}) {
    if (!req.body) {
        return NextResponse.json({ error: 'Missing Request Body' }, { status: 400 });
    }

    const userid = params.userId;
    const data = await req.json();
    let info : UpdateData<User> = data;

    if (!info) {
        return NextResponse.json({ error: 'Invalid User Data' }, { status: 400 });
    } else {
        try {
            await updateAccount(userid, info);
            return NextResponse.json({ message: "Account Successfully Updated" }, { status: 200 });
        } catch {
            return NextResponse.json({ error: 'Error with Updating the Account' }, { status: 404 });
        }
    }
}