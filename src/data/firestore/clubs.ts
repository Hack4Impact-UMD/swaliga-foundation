import { db } from "@/config/firebaseConfig";
import { Club, ClubDoc } from "@/types/club-types";
import { deleteDoc, doc, getDoc, setDoc, Transaction, updateDoc, WriteBatch } from "firebase/firestore";
import { Collection, FirestorePartial } from "./utils";

function getClubDocRef(clubId: string) {
  return doc(db, Collection.CLUBS, clubId);
}

export async function getClubById(clubId: string, transaction?: Transaction): Promise<Club> {
  const clubRef = getClubDocRef(clubId);
  let clubDoc;
  try {
    clubDoc = await (transaction ? transaction.get(clubRef) : getDoc(clubRef));
  } catch (error) {
    throw new Error("Failed to get club");
  }
  if (!clubDoc.exists()) {
    throw new Error("Club not found");
  }
  return {
    ...clubDoc.data() as ClubDoc,
    clubId
  }
}

export async function setClubDoc(club: Club, instance?: Transaction | WriteBatch): Promise<string> {
  const { clubId, ...clubDoc } = club;
  try {
    const clubRef = getClubDocRef(clubId);
    // @ts-ignore
    await (instance ? instance.set(clubRef, clubDoc) : setDoc(clubRef, clubDoc));
    return clubId;
  } catch (error) {
    throw new Error("Failed to set club");
  }
}

export async function updateClubDoc(clubId: string, updates: FirestorePartial<ClubDoc>, instance?: Transaction | WriteBatch): Promise<void> {
  try {
    const clubRef = getClubDocRef(clubId);
    // @ts-ignore
    await (instance ? instance.update(clubRef, updates) : updateDoc(clubRef, updates));
  } catch (error) {
    throw new Error("Failed to update club");
  }
}

export async function deleteClubDoc(clubId: string, instance?: Transaction | WriteBatch): Promise<void> {
  try {
    const clubRef = getClubDocRef(clubId);
    // @ts-ignore
    await (instance ? instance.delete(clubRef) : deleteDoc(clubRef));
  } catch (error) {
    throw new Error("Failed to delete club");
  }
}