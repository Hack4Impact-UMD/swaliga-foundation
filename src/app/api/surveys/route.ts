import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/firebaseConfig';
import { collection, addDoc } from "firebase/firestore"; 

export async function POST(req: NextRequest, res: NextResponse) {
  // 1-1. get access token from client side
  const header = req.headers.get("authorization") || "";
  const accessToken = header.split("Bearer ").at(1);

  if (!accessToken) {
    return NextResponse.json(
      { message: "Access token is missing" },
      { status: 401 }
    );
  }

  // 1-2. get user credentials (admin)
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const forms = google.forms({
    version: "v1",
    auth: auth,
  });

  // 2. create a google form
  const form = await forms.forms.create({
    requestBody: {
      info: {
        title: "Your Form Title",
        documentTitle: "Your Document Title",
      },
    },
  });

  console.log("Form Created: ", form.data);

  // 3. store the data into firestore
  try {
    const formDoc = await addDoc(collection(db, "forms"), {
      formId: form.data.formId,
      title: form.data.info?.title,
      revisionId: form.data.revisionId,
      responderUri: form.data.responderUri,
    });
    console.log("Form added");
  } catch (err) {
    console.log("Error adding document: ", err);
  }

  return NextResponse.json(form.data, { status: 200 });
}
