import { getAccountById, updateAccount } from "@/lib/firebase/database/users";
import { User } from "@/types/User";
import { NextRequest, NextResponse } from 'next/server';
import { UpdateData } from "firebase/firestore";

export async function GET({ params }: { params: { userId: string } }) {
    try {
        const userid = params.userId;
        
        if (!userid) {
            return NextResponse.json({ error: 'Missing UserId' }, { status: 400 });
        } else {
            let strUserId = String(userid);

            try {
                const result = await getAccountById(strUserId);
                return NextResponse.json({ result }, { status: 200 });
            } catch {
                return NextResponse.json({ error: 'Error with Getting the Account Via the Given ID' }, { status: 404 });
            }
        }

    } catch (error) {
        return NextResponse.json({ error: 'Failed to Load Data' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { userId: string }}) {
    try {
        if (!req.body) {
            return NextResponse.json({ error: 'Missing Request Body' }, { status: 400 });
        }

        const userid = params.userId;
        const data = await req.formData();
        let info : UpdateData<User> = Object.fromEntries(data);

        if (!userid) {
            return NextResponse.json({ error: 'Missing UserID' }, { status: 400 });
        } else if (!info) {
            return NextResponse.json({ error: 'Invalid User Data' }, { status: 400 });
        } else {
            try {
                let strUserId = String(userid);
                await updateAccount(strUserId, info);
                return NextResponse.json({ message: "Account Successfully Updated" }, { status: 200 });
            } catch {
                return NextResponse.json({ error: 'Error with Updating the Account' }, { status: 404 });
            }
        }
        
    } catch (err) {
        return NextResponse.json({ error: 'Failed to Load Data' }, { status: 500 });
    }

}