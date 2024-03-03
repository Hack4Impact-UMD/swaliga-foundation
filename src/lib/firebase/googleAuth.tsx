import { auth } from '../../../firebaseConfig';
import { FirebaseError } from 'firebase/app';
import { signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';

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
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const credential = GoogleAuthProvider.credentialFromResult(result);
        const googleToken = credential?.accessToken; 

        const verified = await verifyGoogleToken(googleToken);

        if (verified) {
            console.log("Current user verified");
        } else {
            console.log("Please sign in again");
        }
    } catch (error: unknown) {
        if ((error as FirebaseError).code === 'auth/account-exists-with-different-credential') {
            console.log("Already existing email address");
        }
    };
};

function logOut(): void {
    const user = auth.currentUser;
    if (user) {
        signOut(auth)
        .then(() => {
            console.log("Sign-out successful");
        }).catch((error) => {
            console.log(error);
        });
    } else {
        console.log("No user is signed in");
    }
};

export { signInWithGoogle, logOut };