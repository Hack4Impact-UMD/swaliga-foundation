import { User } from "@/types/user-types";
import { doc, getDoc, updateDoc, getDocs, UpdateData, arrayUnion, arrayRemove, collection, addDoc, query as fsQuery, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function getAccountById(id: string): Promise<User> {
  try {
    const docRef = doc(db, "users", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as User;
    } else {
      console.error("Account or id doesn't exist");
      throw new Error("Account or id doesn't exist");
    }
  } catch (error) {
    console.error("unable to get account");
    throw new Error("unable to get account");
  }
}

export async function createAccount(user: User): Promise<void> {
  try {
    const usersCollectionRef = collection(db, "users");
    const docRef = await addDoc(usersCollectionRef, user);
  } catch (error) {
    console.error("Error creating account");
    throw new Error("Error creating account");
  }
}

export async function updateAccount(id: string, updatedUserData: UpdateData<User>): Promise<void> {
  try {
    const user = doc(db, "users", id);
    await updateDoc(user, updatedUserData);
  } catch (error) {
    console.error("Error updating account:");
    throw new Error("Error updating account");
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
  }

  // Assign a list of students to a list of surveys
  for (const surveyId of surveyIds) {
    const surveyRef = doc(db, "surveys", surveyId);
    await updateDoc(surveyRef, {
      assignedUsers: arrayUnion(...userIds),
    });
  }
}

export async function unassignSurveys(
  userIds: string[],
  surveyIds: string[]
): Promise<void> {
  // Unassign a list of surveys from a list of students.
  for (const userId of userIds) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      assignedSurveys: arrayRemove(...surveyIds),
    });
  }

  // Unassign a list of students from a list of surveys
  for (const surveyId of surveyIds) {
    const surveyRef = doc(db, "surveys", surveyId);
    await updateDoc(surveyRef, {
      assignedUsers: arrayRemove(...userIds),
    });
  }
}