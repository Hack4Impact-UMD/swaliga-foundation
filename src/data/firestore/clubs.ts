import { db } from "@/config/firebaseConfig";
import { Club, ClubDoc } from "@/types/club-types";
import { collection, CollectionReference, deleteDoc, doc, DocumentReference, FirestoreDataConverter, PartialWithFieldValue, QueryDocumentSnapshot, Transaction, updateDoc, WithFieldValue, WriteBatch, type UpdateData } from "firebase/firestore";
import { Collection } from "./collections";
import { batchGetDocs, FirestoreQueryOptions, getDoc, listDocs, setDoc } from "./firestoreClientOperations";

const converters: FirestoreDataConverter<Club, ClubDoc> = {
  fromFirestore: (snapshot: QueryDocumentSnapshot<ClubDoc, Club>) => {
    return {
      ...snapshot.data(),
      clubId: snapshot.id
    }
  },
  toFirestore: (modelObj: PartialWithFieldValue<Club>) => {
    const { clubId, ...rest } = modelObj;
    return rest as WithFieldValue<ClubDoc>;
  },
}

function getClubDocRef(clubId: string) {
  return doc(db, Collection.CLUBS, clubId) as DocumentReference<Club, ClubDoc>;
}

function getClubCollectionRef() {
  return collection(db, Collection.CLUBS) as CollectionReference<Club, ClubDoc>;
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