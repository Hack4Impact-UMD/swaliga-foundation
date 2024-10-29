import { onCall } from "firebase-functions/v2/https";
import { onMessagePublished } from "firebase-functions/v2/pubsub";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { google } from "googleapis";
import { DocumentData, getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin";

const URL_PREFIX = "https://swaliga-foundation.web.app";

// handles form events
exports.handleFormWatch = onMessagePublished("projects/swaliga-foundation/topics/forms", async (event) => {
  const { eventType, formId } = event.data.message.attributes;
  await fetch(`${URL_PREFIX}/api/watches/handler`, {
    method: "POST",
    body: JSON.stringify({ eventType, formId }),
    headers: {
      "Content-Type": "application/json",
    }
  })
});

// "0 0 * * 0,3,5" - every Sunday, Wednesday, and Friday at midnight, renew all watches of currently active forms
exports.setWatchRenewal = onSchedule("0 0 * * 0,4", async (_) => {
  await fetch(`${URL_PREFIX}/api/watches/renewAll`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
})

exports.checkRefreshToken = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    console.log(auth);
    if (!auth?.token || auth.token.role !== "ADMIN") {
      return;
    }

    const authUrl = await getAuthUrl();
    console.log(authUrl);
    console.log("success");
  }
)

async function getOauth2Client(setCreds: boolean = true) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      "https://swaliga-foundation.web.app/api/auth/handler"
    );
    if (setCreds) {
      await setCredentials(oauth2Client);
    }
    return oauth2Client;
  } catch (err) {
    throw new Error("failed to set credentials");
  }
}

async function setCredentials(oauth2Client: any) {
  if (!oauth2Client.credentials.refresh_token) {
    const adminApp = initializeApp();
    const adminDb = getFirestore(adminApp);
    const response = await adminDb.doc("/metadata/adminRefreshToken").get();
    //const response = await getDoc(doc(db, "metadata", "adminRefreshToken"));
    await fetch(
      `https://logger-fuicsqotja-uk.a.run.app?message=${response.data()}`
    );
    if (!response.exists) {
      throw new Error("invalid refresh token");
    }
    const { adminRefreshToken } = response.data() as DocumentData;
    try {
      oauth2Client.setCredentials({ refresh_token: adminRefreshToken });
    } catch (error) {
      throw new Error("invalid refresh token");
    }
  }

  if (
    !oauth2Client.credentials.access_token ||
    (oauth2Client.credentials.expiry_date &&
      Date.now() > oauth2Client.credentials.expiry_date)
  ) {
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);
  }
  const response = await oauth2Client.refreshAccessToken();
  oauth2Client.setCredentials(response.credentials);
}

async function getAuthUrl() {
  const scopes = [
    "https://www.googleapis.com/auth/forms.body",
    "https://www.googleapis.com/auth/forms.responses.readonly",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/gmail.send",
  ];
  const oauth2Client = await getOauth2Client(false);
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
  });
}