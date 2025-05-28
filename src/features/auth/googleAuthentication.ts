import { Role } from '@/types/user-types';
import { auth, functions } from '../../config/firebaseConfig';
import { FirebaseError } from 'firebase/app';
import { signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { httpsCallable } from 'firebase/functions';

async function verifyGoogleToken(googleAccessToken: string | undefined): Promise<boolean> {
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${googleAccessToken}`);
    const data = await response.json();

    if (data.error) {
        console.error("Invalid Token");
        return false;
    } else {
        console.log("Token is valid");
        return true;
    }
}

async function signInWithGoogle(router: AppRouterInstance): Promise<void> {
    const provider = new GoogleAuthProvider();

    // Add scopes for access to Google Forms, Spreadsheets, Gmail
    provider.addScope("https://www.googleapis.com/auth/forms.body");
    provider.addScope("https://www.googleapis.com/auth/forms.responses.readonly");
    provider.addScope("https://www.googleapis.com/auth/spreadsheets");
    provider.addScope("https://www.googleapis.com/auth/gmail.send");

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Verify Google token
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;
        const verified = await verifyGoogleToken(accessToken);

        // Get the current user's ID token result to check custom claims
        const idTokenResult = await auth.currentUser?.getIdTokenResult();
        const role: Role | undefined = idTokenResult?.claims.role as (Role | undefined);
        switch (role) {
            case undefined:
                await fetch("/api/auth/claims/registering", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ uid: user.uid }),
                });
                await auth.currentUser?.getIdToken(true);
                router.push("/create-account");
            case Role.ADMIN:
                const res = await fetch(`/api/auth/refreshToken`);
                const valid = await res.json();
                if (!valid) {
                    console.log(auth.currentUser)
                    console.log('valid', valid)
                    const validateToken = httpsCallable(functions, "checkRefreshToken")
                    await validateToken();
                } else {
                    router.push("/admin-dashboard");
                }
                break;
            case Role.STUDENT:
                router.push("/student-dashboard");
                break;
            default:
                break;
        }
    } catch (error: unknown) {
        console.error("unable to sign in with Google")
    }
}

async function logOut(): Promise<void> {
    const user = auth.currentUser;
    if (user) {
        await auth.signOut();
    }
};

export { signInWithGoogle, logOut };