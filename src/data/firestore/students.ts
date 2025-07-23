import { db } from "@/config/firebaseConfig";
import { Student } from "@/types/user-types";
import { deleteDoc, doc, getDoc, setDoc, Transaction, updateDoc, WriteBatch } from "firebase/firestore";
import { Collection } from "./utils";

export async function getStudentById(id: string, transaction?: Transaction): Promise<Student> {
  const studentRef = doc(db, Collection.STUDENTS, id);
  let studentDoc;
  try {
    studentDoc = await (transaction ? transaction.get(studentRef) : getDoc(studentRef));
  } catch (error) {
    throw new Error("Failed to get student");
  }
  if (!studentDoc.exists()) {
    throw new Error("Student not found");
  }
  return studentDoc.data() as Student;
}

export async function createStudent(student: Student, instance?: Transaction | WriteBatch): Promise<void> {
  try {
    const studentRef = doc(db, Collection.STUDENTS, student.id);
    // @ts-ignore
    await (instance ? instance.set(studentRef, student) : setDoc(studentRef, student))
  } catch (error) {
    throw new Error("Failed to create student");
  }
}

export async function updateStudent(id: string, updates: Partial<Student>, instance?: Transaction | WriteBatch): Promise<void> {
  try {
    const studentRef = doc(db, Collection.STUDENTS, id);
    // @ts-ignore
    await (instance ? instance.update(studentRef, updates) : updateDoc(studentRef, updates));
  } catch (error) {
    throw new Error("Failed to update student");
  }
}

export async function deleteStudent(id: string, instance?: Transaction | WriteBatch): Promise<void> {
  try {
    const studentRef = doc(db, Collection.STUDENTS, id);
    // @ts-ignore
    await (instance ? instance.delete(studentRef) : deleteDoc(studentRef));
  } catch (error) {
    throw new Error("Failed to delete student");
  }
}