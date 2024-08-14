import { updateRefreshToken } from '@/lib/googleAuthorization';
import { auth } from '../firebaseConfig';
import { FirebaseError } from 'firebase/app';
import { signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

async function verifyGoogleToken(googleAccessToken: string | undefined): Promise<boolean> {
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${googleAccessToken}`);
    const data = await response.json();

    if (data.error) { 
        console.error("Invalid Token", data.error);
        return false;
    } else {
        console.log("Token is valid", data);
        return true;
    }
}

async function signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    // add scopes for access to Google Forms and Gmail
    provider.addScope("https://www.googleapis.com/auth/forms.body");
    provider.addScope("https://www.googleapis.com/auth/forms.responses.readonly");
    provider.addScope("https://www.googleapis.com/auth/spreadsheets");
    provider.addScope("https://www.googleapis.com/auth/gmail.send")
    try {
        console.log(auth.currentUser);
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;
        const verified = await verifyGoogleToken(accessToken);   

        if (verified) {
            console.log("Current user verified:", auth.currentUser?.uid);
        } else {
            console.log("Please sign in again");
        }

        const idTokenResult = await auth.currentUser?.getIdTokenResult();
        const role = idTokenResult?.claims.role;
        switch (role) {
          case undefined:
            await fetch("/api/auth/claims", {
              method: "POST",
              body: JSON.stringify({ uid: result.user.uid }),
            });
            await auth.currentUser?.getIdTokenResult(true); // refresh ID token upon account creation to set role in user claims
            break;
          case "ADMIN":
            await fetch("/api/auth/refreshToken", { method: "POST" });
            break;
          default:
            break;
        }
    } catch (error: unknown) {
        if ((error as FirebaseError).code === 'auth/account-exists-with-different-credential') {
            console.log("Already existing email address");
        }
    };
};

async function logOut(): Promise<void> {
    const user = auth.currentUser;
    if (user) {
        await signOut(auth);
        console.log("Sign-out successful");
    } else {
        console.log("No user is signed in");
    }
};

export { signInWithGoogle, logOut };