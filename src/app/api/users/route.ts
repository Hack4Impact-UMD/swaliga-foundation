import { createAccount, getAllUsers } from "@/lib/firebase/database/users";
import { User } from "@/types/user-types";
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const users: User[] = await getAllUsers();
    return NextResponse.json(users, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to Load Data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!req.body) {
      return NextResponse.json({ error: 'Missing Request Body' }, { status: 400 });
    }

    const data = await req.json();
    const user: User = data;

    try {
      await createAccount(user);
      return NextResponse.json({ message: 'Account Created Successfully' }, { status: 200 });
    } catch {
      return NextResponse.json({ error: 'Error with Creating the Account' }, { status: 404 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Failed to Load Data' }, { status: 500 });
  }
}
