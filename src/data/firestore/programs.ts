import { db } from "@/config/firebaseConfig";
import { Program, ProgramDoc } from "@/types/club-types";
import { collection, CollectionReference, doc, DocumentReference, DocumentSnapshot, Transaction, WriteBatch, type UpdateData } from "firebase/firestore";
import { Collection, ClubsSubcollection } from "./collections";
import { aggregateDocs, AggregationClause, batchGetDocs, deleteDoc, FirestoreQueryOptions, getDoc, listDocs, setDoc, SetDocOptions, updateDoc } from "./firestoreClientOperations";

function programConverter(snapshot: DocumentSnapshot<ProgramDoc, ProgramDoc>): Program {
  if (!snapshot.exists()) {
    throw new Error("Program not found")
  };
  return {
    programId: snapshot.id,
    clubId: snapshot.ref.parent.parent!.id,
    ...snapshot.data()
  };
}

function getProgramDocRef(programId: string, clubId: string) {
  return doc(db, Collection.CLUBS, clubId, ClubsSubcollection.PROGRAMS, programId) as DocumentReference<ProgramDoc, ProgramDoc>;
}

function getProgramCollectionRef(clubId: string) {
  return collection(db, Collection.CLUBS, clubId, ClubsSubcollection.PROGRAMS) as CollectionReference<ProgramDoc, ProgramDoc>;
}

export async function getProgramDoc(programId: string, clubId: string, transaction?: Transaction) {
  return await getDoc(getProgramDocRef(programId, clubId), { transaction, converter: programConverter });
}

export async function batchGetProgramDocs(clubId: string, programIds: string[]) {
  return await batchGetDocs(getProgramCollectionRef(clubId), programIds, programConverter);
}

export async function listProgramDocs(clubId: string, queryOptions?: FirestoreQueryOptions<ProgramDoc>) {
  return await listDocs(getProgramCollectionRef(clubId), { queryOptions, converter: programConverter });
}

export async function aggregateProgramDocs(clubId: string, aggregations: AggregationClause<ProgramDoc>[], queryOptions?: FirestoreQueryOptions<ProgramDoc>) {
  return await aggregateDocs(getProgramCollectionRef(clubId), { aggregations, queryOptions });
}

export async function setProgramDoc(programId: string, clubId: string, doc: ProgramDoc, options?: SetDocOptions) {
  return await setDoc(getProgramDocRef(programId, clubId), doc, options); 
}

export async function updateProgramDoc(programId: string, clubId: string, updates: UpdateData<ProgramDoc>, instance?: Transaction | WriteBatch) {
  return await updateDoc(getProgramDocRef(programId, clubId), updates, instance);
}

export async function deleteProgramDoc(programId: string, clubId: string, instance?: Transaction | WriteBatch) {
  return await deleteDoc(getProgramDocRef(programId, clubId), instance);
}
