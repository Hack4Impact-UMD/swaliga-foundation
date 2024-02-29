import { User } from "@/types/UserType";
import { collection, doc, addDoc, getDoc, updateDoc, deleteDoc, collectionGroup, query, getDocs, Query, orderBy, DocumentData } from "firebase/firestore";
import { db } from "./firebaseConfig";

export async function getAccountById(id: string): Promise<User> {
  try {
    const docRef = doc(db, "Users", id);
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

async function createAccount(user: User): Promise<void> {
  try {
    const usersCollectionRef = collection(db, "Users");
    await addDoc(usersCollectionRef, user);
    console.log("Account created successfully");
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
}

async function deleteUserAccount(id: string): Promise<void> {
    try {
      const userRef = doc(db, "Users", id);
      await deleteDoc(userRef);
      console.log("User account deleted successfully");
    } catch (error) {
      console.error("Error deleting user account:", error);
      throw error;
    }
  }

async function updatePassword(id: string, newPassword: string): Promise<void> {
  try {
    const user = doc(db, "Users", id);
    await updateDoc(user, { password: newPassword });
    console.log("Password updated successfully");
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
}

async function getUserList(): Promise<User[]> {
    try {
        const usersList: User[] = [];
        const querySnapshot = await getDocs(collectionGroup(db, "Users"));
        
        querySnapshot.forEach((doc) => {
          usersList.push(doc.data() as User);
        });
        return usersList;

    } catch (error) {
        console.error("Error getting list of users: ", error);
        throw error;
    }
}