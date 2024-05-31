import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";

async function checkEmailExists(email: string): Promise<boolean> {
    const ref = collection(db, "users");
    const q = query(ref, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        console.log("Email already exists in the database");
        return true;
    } else {
        console.log("Email does not exist. You can register or sign-in with this email");
        return false;
    }
}

export { checkEmailExists };