import { db } from "@/config/firebaseConfig";
import { Club, ClubDoc } from "@/types/club-types";
import { deleteDoc, doc, getDoc, setDoc, Transaction, updateDoc, WriteBatch } from "firebase/firestore";
import { Collection, FirestorePartial } from "./utils";
import { v4 } from "uuid";

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
  return clubDoc.data() as Club;
}

export async function setClub(club: ClubDoc, instance?: Transaction | WriteBatch): Promise<string> {
  const clubId = v4();
  try {
    const clubRef = getClubDocRef(clubId);
    // @ts-ignore
    await (instance ? instance.set(clubRef, club) : setDoc(clubRef, club));
    return clubId;
  } catch (error) {
    throw new Error("Failed to create club");
  }
}

export async function updateClub(clubId: string, updates: FirestorePartial<ClubDoc>, instance?: Transaction | WriteBatch): Promise<void> {
  try {
    const clubRef = getClubDocRef(clubId);
    // @ts-ignore
    await (instance ? instance.update(clubRef, updates) : updateDoc(clubRef, updates));
  } catch (error) {
    throw new Error("Failed to update club");
  }
}

export async function deleteClub(clubId: string, instance?: Transaction | WriteBatch): Promise<void> {
  try {
    const clubRef = getClubDocRef(clubId);
    // @ts-ignore
    await (instance ? instance.delete(clubRef) : deleteDoc(clubRef));
  } catch (error) {
    throw new Error("Failed to delete club");
  }
}