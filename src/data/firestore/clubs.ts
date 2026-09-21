import { db } from "@/config/firebaseConfig";
import { Club, ClubDoc } from "@/types/club-types";
import { collection, CollectionReference, deleteDoc, doc, DocumentReference, DocumentSnapshot, Transaction, updateDoc, WriteBatch, type UpdateData } from "firebase/firestore";
import { Collection } from "./collections";
import { batchGetDocs, FirestoreQueryOptions, getDoc, listDocs, setDoc } from "./firestoreClientOperations";

const clubConverter = (snapshot: DocumentSnapshot<ClubDoc, ClubDoc>) => ({
  clubId: snapshot.id,
  ...snapshot.data()
})

function getClubDocRef(clubId: string) {
  return doc(db, Collection.CLUBS, clubId) as DocumentReference<ClubDoc, ClubDoc>;
}

function getClubCollectionRef() {
  return collection(db, Collection.CLUBS) as CollectionReference<ClubDoc, ClubDoc>;
}

export async function getClubDoc(clubId: string, transaction?: Transaction) {
  return getDoc(getClubDocRef(clubId), { transaction, converter: clubConverter });
}

export async function batchGetClubDocs(clubIds: string[]) {
  return batchGetDocs(getClubCollectionRef(), clubIds, clubConverter);
}

export async function listClubDocs(queryOptions: FirestoreQueryOptions<ClubDoc>) {
  return listDocs(getClubCollectionRef(), { queryOptions, converter: clubConverter });
}

export async function setClubDoc(club: Club, instance?: Transaction | WriteBatch): Promise<string> {
  return setDoc(getClubDocRef(club.clubId), club);
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

export async function updateClubDoc(clubId: string, updates: UpdateData<ClubDoc>, instance?: Transaction | WriteBatch): Promise<void> {
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