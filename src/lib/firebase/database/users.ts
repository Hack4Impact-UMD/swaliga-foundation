import { User } from "@/types/user-types";
import { collection, doc, addDoc, setDoc, getDoc, updateDoc, deleteDoc, collectionGroup, getDocs, UpdateData } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function getAccountById(id: string): Promise<User> {
  try {
    const docRef = doc(db, "users", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      console.log("Retrieved account successfully");
      return snapshot.data() as User;
    } else {
      console.log("Account or id doesn't exist");
      throw new Error("Account or id doesn't exist");
    }
  } catch (error) {
    console.error("Error with retrieving account by id: ", error);
    throw error;
  }
}

export async function createAccount(user: User): Promise<void> {
  try {
    const usersCollectionRef = doc(db, "users", user.id);
    await setDoc(usersCollectionRef, user);
    console.log("Account created successfully");
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
}

export async function updateAccount(id: string, updatedUserData: UpdateData<User>): Promise<void> {
  try {
    const user = doc(db, "users", id);
    await updateDoc(user, updatedUserData);
    console.log("Account updated successfully");
  } catch (error) {
    console.error("Error updating account:", error);
    throw error;
  }
}

export async function deleteUserAccount(id: string): Promise<void> {
    try {
      const userRef = doc(db, "users", id);
      await deleteDoc(userRef);
      console.log("User account deleted successfully");
    } catch (error) {
      console.error("Error deleting user account:", error);
      throw error;
    }
  }

export async function updatePassword(id: string, newPassword: string): Promise<void> {
  try {
    const user = doc(db, "users", id);
    await updateDoc(user, { password: newPassword });
    console.log("Password updated successfully");
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
}

export async function getUserList(): Promise<User[]> {
    try {
        const usersList: User[] = [];
        const querySnapshot = await getDocs(collectionGroup(db, "users"));
        
        querySnapshot.forEach((doc) => {
          usersList.push(doc.data() as User);
        });
        return usersList;

    } catch (error) {
        console.error("Error getting list of users: ", error);
        throw error;
    }
}