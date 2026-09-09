import { db } from "@/config/firebaseConfig";
import { Program, ProgramDoc } from "@/types/club-types";
import { deleteDoc, doc, getDoc, setDoc, Transaction, updateDoc, WriteBatch } from "firebase/firestore";
import { Collection, FirestorePartial } from "./utils";
import { v4 } from "uuid";

function getProgramDocRef(clubId: string, programId: string) {
  return doc(db, Collection.CLUBS, clubId, Collection.PROGRAMS, programId);
}

export async function getProgramById(programId: string, clubId: string, transaction?: Transaction): Promise<Program> {
  const programRef = getProgramDocRef(clubId, programId);
  let programDoc;
  try {
    programDoc = await (transaction ? transaction.get(programRef) : getDoc(programRef));
  } catch (error) {
    throw new Error("Failed to get program");
  }
  if (!programDoc.exists()) {
    throw new Error("Program not found");
  }
  return programDoc.data() as Program;
}

export async function setProgram(program: ProgramDoc, clubId: string, instance?: Transaction | WriteBatch): Promise<string> {
  const programId = v4();
  try {
    const programRef = getProgramDocRef(clubId, programId);
    // @ts-ignore
    await (instance ? instance.set(programRef, program) : setDoc(programRef, program));
    return programId;
  } catch (error) {
    throw new Error("Failed to create program");
  }
}

export async function updateProgram(programId: string, clubId: string, updates: FirestorePartial<ProgramDoc>, instance?: Transaction | WriteBatch): Promise<void> {
  try {
    const programRef = getProgramDocRef(clubId, programId);
    // @ts-ignore
    await (instance ? instance.update(programRef, updates) : updateDoc(programRef, updates));
  } catch (error) {
    throw new Error("Failed to update program");
  }
}

export async function deleteProgram(programId: string, clubId: string, instance?: Transaction | WriteBatch): Promise<void> {
  try {
    const programRef = getProgramDocRef(clubId, programId);
    // @ts-ignore
    await (instance ? instance.delete(programRef) : deleteDoc(programRef));
  } catch (error) {
    throw new Error("Failed to delete program");
  }
}