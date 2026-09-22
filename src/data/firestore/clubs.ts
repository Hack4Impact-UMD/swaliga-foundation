import { db } from "@/config/firebaseConfig";
import { ClubDoc } from "@/types/club-types";
import { collection, CollectionReference, doc, DocumentReference, DocumentSnapshot, Transaction, WriteBatch, type UpdateData } from "firebase/firestore";
import { Collection } from "./collections";
import { batchGetDocs, deleteDoc, FirestoreQueryOptions, getDoc, listDocs, setDoc, SetDocOptions, updateDoc } from "./firestoreClientOperations";

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
  return await getDoc(getClubDocRef(clubId), { transaction, converter: clubConverter });
}

export async function batchGetClubDocs(clubIds: string[]) {
  return await batchGetDocs(getClubCollectionRef(), clubIds, clubConverter);
}

export async function listClubDocs(queryOptions: FirestoreQueryOptions<ClubDoc>) {
  return await listDocs(getClubCollectionRef(), { queryOptions, converter: clubConverter });
}

export async function setClubDoc(clubId: string, doc: ClubDoc, options?: SetDocOptions): Promise<void> {
  await setDoc(getClubDocRef(clubId), doc, options);
}

export async function updateClubDoc(clubId: string, updates: UpdateData<ClubDoc>, instance?: Transaction | WriteBatch): Promise<void> {
  await updateDoc(getClubDocRef(clubId), updates, instance);
}

export async function deleteClubDoc(clubId: string, instance?: Transaction | WriteBatch): Promise<void> {
  await deleteDoc(getClubDocRef(clubId), instance);
}