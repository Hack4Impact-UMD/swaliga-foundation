import { getAccountById, updateAccount } from "@/lib/firebase/database/users";
import { User } from "@/types/user-types";
import { NextRequest, NextResponse } from "next/server";
import { UpdateData } from "firebase/firestore";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userid = params.userId;

  try {
    const user = await getAccountById(userid);
    return NextResponse.json(user, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error with Getting the Account Via the Given ID" },
      { status: 404 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  if (!req.body) {
    return NextResponse.json(
      { error: "Missing Request Body" },
      { status: 400 }
    );
  }

  const userid = params.userId;
  const data: UpdateData<User> = await req.json();
  if (!data) {
    return NextResponse.json({ error: "Invalid User Data" }, { status: 400 });
  }

  try {
    await updateAccount(userid, data);
    return NextResponse.json(
      { message: "Account Successfully Updated" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Error with Updating the Account" },
      { status: 404 }
    );
  }
}
