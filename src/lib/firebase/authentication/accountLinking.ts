import { db, auth } from '../firebaseConfig';
import { getAuth, linkWithPopup, GoogleAuthProvider } from "firebase/auth";

// Example:
// 1. Existing Email/PWD account: (abc@gmail.com)
// 2. An user wants to link a new sign-in google account (fgh@gmail.com)
async function linkingAccount(): Promise<void> {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        // User is signed in
        const provider = new GoogleAuthProvider();
        try {
            await linkWithPopup(user, provider);
            console.log("Accounts successfully linked");
        } catch (error) {
            console.log("Error occured while linking your account", error);
        }
    } else {
        // No user is signed in.
        alert("Sign-in needed");
        // redirect to the login page
        window.location.href = 'route/to/login';
    }
}

export { linkingAccount };