import { db } from "@/config/firebaseConfig";
import { Club, ClubDoc } from "@/types/club-types";
import { deleteDoc, doc, getDoc, setDoc, Transaction, updateDoc, WriteBatch, type UpdateData } from "firebase/firestore";
import { Collection } from "./collections";
import { v4 } from "uuid";

function getClubDocRef(clubId: string) {
  return doc(db, Collection.CLUBS, clubId);
}

function getClubCollectionRef() {
  return collection(db, Collection.CLUBS);
}

export async function getClubDoc(clubId: string, transaction?: Transaction) {
  return getDoc(getClubDocRef(clubId), { transaction, converters });
}

export async function batchGetClubDocs(clubIds: string[]) {
  return batchGetDocs(getClubCollectionRef(), clubIds, converters);
}

export async function listClubDocs(queryOptions: FirestoreQueryOptions<ClubDoc>) {
  return listDocs(getClubCollectionRef(), { queryOptions, converters });
}

export async function setClub(club: ClubDoc, instance?: Transaction | WriteBatch): Promise<string> {
  const clubId = v4();
  try {
    const clubRef = getClubDocRef(clubId);
    // @ts-ignore
    await (instance ? instance.set(clubRef, club) : setDoc(clubRef, club));
    return clubId;
  } catch (error) {
    throw new Error("Failed to set club");
  }
}

export async function updateClub(clubId: string, updates: UpdateData<ClubDoc>, instance?: Transaction | WriteBatch): Promise<void> {
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