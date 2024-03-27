import { NextRequest, NextResponse } from "next/server";
import { forms } from "@/lib/googleAuthorization";
import { db } from "@/lib/firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {
  const body = await req.json();

  let form = null;
  try {
    form = await forms.forms.create({
      requestBody: {
        info: {
          title: body.title,
          documentTitle: body.documentTitle,
        },
      },
    });
  } catch (err) {
    return NextResponse.json(
      { message: "error creating google form" },
      { status: 401 }
    );
  }

  try {
    await addDoc(collection(db, "surveys"), form.data);
    return NextResponse.json(
      { message: "survey successfully created" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "cannot add survey to firestore" },
      { status: 500 }
    );
  }
}
