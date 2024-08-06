import { getAccountById, updateAccount, createAccount } from "@/lib/firebase/database/users";
import { User } from "@/types/user-types";
import { NextRequest, NextResponse } from "next/server";
import { UpdateData } from "firebase/firestore";

// gets user by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  try {
    const user = await getAccountById(userId);
    if (user) {
      return NextResponse.json(user, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error with Getting the Account Via the Given ID", error);
    return NextResponse.json(
      { error: "Error with Getting the Account Via the Given ID" },
      { status: 500 }
    );
  }
}

// updates fields of a user to the new values provided
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

  const userId = params.userId;
  const data: UpdateData<User> = await req.json();
  if (!data) {
    return NextResponse.json({ error: "Invalid User Data" }, { status: 400 });
  }

  try {
    await updateAccount(userId, data);
    return NextResponse.json(
      { message: "Account Successfully Updated" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error with Updating the Account", error);
    return NextResponse.json(
      { error: "Error with Updating the Account" },
      { status: 404 }
    );
  }
}

// creates a new user in Firestore
export async function POST(req: NextRequest) {
  if (!req.body) {
    return NextResponse.json(
      { error: "Missing Request Body" },
      { status: 400 }
    );
  }

  const data: User = await req.json();
  if (!data) {
    return NextResponse.json({ error: "Invalid User Data" }, { status: 400 });
  }

  try {
    await createAccount(data);
    return NextResponse.json(
      { message: "Account Successfully Created" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error with Creating the Account" },
      { status: 500 }
    );
  }
}
