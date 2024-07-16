import { User } from "@/types/user-types";
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collectionGroup, getDocs, UpdateData, arrayUnion, arrayRemove, collection, addDoc, query as fsQuery, where } from "firebase/firestore";
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

/*export async function createAccount(user: User): Promise<void> {
  try {
    console.log("Attempting to create account: ", user);
    console.log("User ID:", user.id);
    const usersCollectionRef = doc(db, "users", user.id);
    await setDoc(usersCollectionRef, user);
    console.log("Account created successfully");
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
}
*/
export async function createAccount(user: User): Promise<void> {
  try {
    console.log("Attempting to create account: ", user);
    const usersCollectionRef = collection(db, "users");
    const docRef = await addDoc(usersCollectionRef, user);
    console.log("Account created successfully with ID: ", docRef.id);
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

export async function getAllUsers(filters: Record<string, any> = {}) {
  let query = fsQuery(collection(db, "users"));
  Object.keys(filters).forEach((key) => {
    if (filters[key]) {
      query = fsQuery(query, where(key, "==", filters[key]));
    }
  });

  const snapshot = await getDocs(query);
  const users = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as User)
  );

  return users;
}

export async function assignSurveys(
  userIds: string[],
  surveyIds: string[]
): Promise<void> {
  // Assign a list of surveys to a list of students
  for (const userId of userIds) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      assignedSurveys: arrayUnion(...surveyIds),
    });

    console.log(`Surveys ${surveyIds} assigned to User ${userId}`);
    // If user already added don't do nothing/remove..
    // TODO Make this both ways...get this done by tomorrow.
  }

  // Assign a list of students to a list of surveys
  for (const surveyId of surveyIds) {
    const surveyRef = doc(db, "surveys", surveyId);
    await updateDoc(surveyRef, {
      assignedUsers: arrayUnion(...userIds),
    });

    console.log(`Users ${userIds} assigned to Survey ${surveyId}`);
  }
}

export async function removeSurveys(
  userIds: string[],
  surveyIds: string[]
): Promise<void> {
  // Unassign a list of surveys from a list of students.
  for (const userId of userIds) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      assignedSurveys: arrayRemove(...surveyIds),
    });

    console.log(`Surveys ${surveyIds} removed from User ${userId}`);
  }

  // Unassign a list of students from a list of surveys
  for (const surveyId of surveyIds) {
    const surveyRef = doc(db, "surveys", surveyId);
    await updateDoc(surveyRef, {
      assignedUsers: arrayRemove(...userIds),
    });

    console.log(`Users ${userIds} removed from Survey ${surveyId}`);
  }
}