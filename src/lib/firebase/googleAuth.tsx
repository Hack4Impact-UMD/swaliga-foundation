import { useEffect } from 'react';
import { auth } from '../../../firebaseConfig';
import { signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';

async function signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
        // if the same email id is in the database (not google account)
        await signInWithPopup(auth, provider)
        .then((result) => {
            // the signed-in user info
            const user = result.user;

            // get the token from a user -> Promise<string> ??
            const token = user.getIdToken();

            // generate Google access Token ??
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const googleToken = credential?.accessToken;
            console.log('token', token);
        }).catch((error) => {
            console.log(error);
        });
        // when login succeed
        // need to add logics
    } catch (error: unknown) {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        console.error(error);
        // when an error occurs
        // need to add logics
    }
};

function logOut(): void {
    // need to add logics
    signOut(auth);
};

export { signInWithGoogle, logOut };