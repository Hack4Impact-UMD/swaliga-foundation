import { FirebaseError } from "firebase/app";
import { DocumentReference, Query, Transaction, WriteBatch, DocumentSnapshot, getDoc as getFirestore, setDoc as setFirestore, updateDoc as updateFirestore, deleteDoc as deleteFirestore, getDocs as queryFirestore, WithFieldValue, DocumentData, UpdateData, CollectionReference, collectionGroup, where as whereFirestore, orderBy as orderByFirestore, limit, limitToLast, startAfter, startAt, endBefore, endAt, query, documentId, getAggregateFromServer, count, AggregateField, sum, average, PartialWithFieldValue, QueryDocumentSnapshot, FirestoreDataConverter, SetOptions, WhereFilterOp, AggregateType } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { Collection } from "./collections";

export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;
export type DistributiveKeyof<T> = T extends T ? keyof T : never
export type NonEmptyArray<T> = [T, ...T[]]
export type Nullable<T> = { [K in keyof T]: T[K] | null; };
export type StrictExtract<T, U extends T> = Extract<T, U>;

interface GetDocOptions<DbModelType extends DocumentData, AppModelType = DbModelType> {
  transaction?: Transaction;
  converters?: FirestoreDataConverter<AppModelType, DbModelType>;
}

interface GetDocResponse<DbModelType extends DocumentData, AppModelType = DbModelType> {
  doc: AppModelType;
  snapshot: DocumentSnapshot<AppModelType, DbModelType>;
}

export async function getDoc<DbModelType extends DocumentData, AppModelType = DbModelType>(ref: DocumentReference<AppModelType, DbModelType>, options?: GetDocOptions<DbModelType, AppModelType>): Promise<GetDocResponse<DbModelType, AppModelType>> {
  const { transaction, converters } = options || {};
  let snapshot: DocumentSnapshot<AppModelType, DbModelType>;
  try {
    if (converters) {
      ref = ref.withConverter(converters);
    }
    snapshot = await (transaction ? transaction.get(ref) : getFirestore(ref));
  } catch {
    throw Error("Error getting document");
  }

  if (!snapshot.exists()) {
    throw Error("Document not found");
  }
  return {
    doc: snapshot.data(),
    snapshot
  };
}

const FIRESTORE_WHERE_IN_LIMIT = 30;
export async function batchGetDocs<DbModelType extends DocumentData, AppModelType = DbModelType>(collection: CollectionReference<AppModelType, DbModelType>, ids: string[]): Promise<QueryDocumentSnapshot<AppModelType, DbModelType>[]> {
  try {
    const idBatches = [];
    for (let i = 0; i < ids.length; i += FIRESTORE_WHERE_IN_LIMIT) {
      idBatches.push(ids.slice(i, i + FIRESTORE_WHERE_IN_LIMIT));
    }
    const queries = idBatches.map(idBatch => executeQuery(collection, { where: [['__name__', 'in', idBatch ]] }));
    const responses = await Promise.all(queries);
    return responses.flatMap(response => response)
  } catch {
    throw Error("Failed to batch get documents");
  }
}

export type SetDocOptions = SetDocMergeOptions | SetDocOverwriteOptions;
export interface SetDocMergeOptions {
  instance?: Transaction | WriteBatch;
  mergeOptions: SetOptions;
}
export interface SetDocOverwriteOptions {
  instance?: Transaction | WriteBatch;
};

export async function setDoc<DbModelType extends DocumentData>(ref: DocumentReference<DbModelType, DbModelType>, data: WithFieldValue<DbModelType>, options?: SetDocOverwriteOptions): Promise<void>
export async function setDoc<DbModelType extends DocumentData>(ref: DocumentReference<DbModelType, DbModelType>, data: PartialWithFieldValue<DbModelType>, options: SetDocMergeOptions): Promise<void>
export async function setDoc<DbModelType extends DocumentData>(ref: DocumentReference<DbModelType, DbModelType>, data: WithFieldValue<DbModelType> | PartialWithFieldValue<DbModelType>, options?: SetDocOptions): Promise<void> {
  try {
    options = options ?? {};
    const { instance } = options;
    if ('mergeOptions' in options) {
        // @ts-expect-error - both Transaction & WriteBatch have a set with the same signature, but TypeScript fails to recognize that
      await (instance ? instance.set(ref, data, options.mergeOptions) : setFirestore(ref, data, options.mergeOptions));
    } else {
        // @ts-expect-error - both Transaction & WriteBatch have a set with the same signature, but TypeScript fails to recognize that
      await (instance ? instance.set(ref, data) : setFirestore(ref, data));
    }
  } catch {
    throw Error("Failed to set document")
  }
}

export async function updateDoc<DbModelType extends DocumentData>(ref: DocumentReference<DbModelType, DbModelType>, data: UpdateData<DbModelType>, instance?: Transaction | WriteBatch): Promise<void> {
  try {
    // @ts-expect-error - both Transaction & WriteBatch have a set with the same signature, but TypeScript fails to recognize that
    await (instance ? instance.update(ref, data) : updateFirestore(ref, data));
  } catch (error) {
    if (error instanceof FirebaseError && error.code === "not-found") {
      throw Error("Attempted to update a document that doesn't exist");
    }
    throw Error("Failed to update document");
  }
}

export async function deleteDoc<DbModelType extends DocumentData>(ref: DocumentReference<DbModelType, DbModelType>, instance?: Transaction | WriteBatch): Promise<void> {
  try {
    await (instance ? instance.delete(ref) : deleteFirestore(ref));
  } catch {
    throw Error("Failed to delete document");
  }
}

export type FirestoreDocumentFieldPath<T> = DistributiveKeyof<UpdateData<T>> & string;
export type FirestoreDocumentFieldPathAndID<T> = FirestoreDocumentFieldPath<T> | '__name__';

export type WhereClause<DbModelType> = [
  FirestoreDocumentFieldPathAndID<DbModelType>,
  WhereFilterOp,
  unknown
];

export type OrderByClause<DbModelType> = [
  FirestoreDocumentFieldPathAndID<DbModelType>,
  'asc' | 'desc'
];

export type LimitClause =
  | { limit: number; limitToLast?: never; }
  | { limit?: never; limitToLast: number; }
  | { limit?: never; limitToLast?: never; };

export type StartCursorClause =
  | { startAfter: DocumentSnapshot | unknown[]; startAt?: never; }
  | { startAfter?: never; startAt: DocumentSnapshot | unknown[]; }
  | { startAfter?: never; startAt?: never; };

export type EndCursorClause =
  | { endBefore: DocumentSnapshot | unknown[]; endAt?: never; }
  | { endBefore?: never; endAt: DocumentSnapshot | unknown[]; }
  | { endBefore?: never; endAt?: never; };

export type FirestoreQueryOptions<DbModelType extends DocumentData> = {
  where?: WhereClause<DbModelType>[];
  orderBy?: OrderByClause<DbModelType>[];
} & LimitClause & StartCursorClause & EndCursorClause;

export type ListDocsResponse<AppModelType, DbModelType extends DocumentData> =
  | {
    docs: [];
    firstSnapshot?: never;
    lastSnapshot?: never;
  }
  | {
    docs: NonEmptyArray<AppModelType>;
    firstSnapshot: QueryDocumentSnapshot<DbModelType, DbModelType>;
    lastSnapshot: QueryDocumentSnapshot<DbModelType, DbModelType>;
  }

export type AggregationClause<DbModelType> = { aggregateFieldName: string; } & (
  | { operation: StrictExtract<AggregateType, 'count'>; }
  | { operation: StrictExtract<AggregateType, 'sum' | 'avg'>; sourceFieldPath: FirestoreDocumentFieldPath<DbModelType>; })

export type AggregationQueryOptions<DbModelType extends DocumentData> = FirestoreQueryOptions<DbModelType> & { aggregations: AggregationClause<DbModelType>[]; }

export function isNotFoundError(error: unknown): boolean {
  return error instanceof Error && error.message === "Document not found";
}

export async function assertDocumentDoesNotExist(ref: DocumentReference, instance?: Transaction): Promise<void> {
  const doc = await (instance ? instance.get(ref) : getFirestore(ref));
  if (doc.exists()) {
    throw Error("Document already exists");
  }
}

function buildQuery<DbModelType extends DocumentData>(collection: CollectionReference<DbModelType, DbModelType> | Collection, options?: FirestoreQueryOptions<DbModelType>): Query<DbModelType, DbModelType> {
  let queryObj: Query<DbModelType, DbModelType> = typeof collection === 'string' ? collectionGroup(db, collection) as Query<DbModelType, DbModelType> : collection;
  if (options) {
    const { where = [], orderBy = [] } = options;
    const whereClauses = where.map(([ fieldPath, operation, value ]) => whereFirestore(fieldPath === '__name__' ? documentId() : fieldPath, operation, value));
    const orderByClauses = orderBy.map(([ fieldPath, direction ]) => orderByFirestore(fieldPath === '__name__' ? documentId() : fieldPath, direction));

    const limitAndCursorClauses = [];
    if ('limit' in options && options.limit) {
      limitAndCursorClauses.push(limit(options.limit));
    } else if ('limitToLast' in options && options.limitToLast) {
      limitAndCursorClauses.push(limitToLast(options.limitToLast));
    }

    if ('startAfter' in options && options.startAfter) {
      limitAndCursorClauses.push(Array.isArray(options.startAfter) ? startAfter(...options.startAfter) : startAfter(options.startAfter));
    } else if ('startAt' in options && options.startAt) {
      limitAndCursorClauses.push(Array.isArray(options.startAt) ? startAt(...options.startAt) : startAt(options.startAt));
    }

    if ('endBefore' in options && options.endBefore) {
      limitAndCursorClauses.push(Array.isArray(options.endBefore) ? endBefore(...options.endBefore) : endBefore(options.endBefore));
    } else if ('endAt' in options && options.endAt) {
      limitAndCursorClauses.push(Array.isArray(options.endAt) ? endAt(...options.endAt) : endAt(options.endAt));
    }

    queryObj = query(queryObj, ...whereClauses, ...orderByClauses, ...limitAndCursorClauses);
  }
  return queryObj;
}

export function mapSnapshotsToPaginatedQueryResult<AppModelType, DbModelType extends DocumentData>(snapshots: QueryDocumentSnapshot<DbModelType, DbModelType>[], mapFunc: (snapshot: QueryDocumentSnapshot<DbModelType, DbModelType>) => AppModelType): ListDocsResponse<AppModelType, DbModelType> {
  return snapshots.length === 0 ? { docs: [] } : {
    docs: snapshots.map(mapFunc) as NonEmptyArray<AppModelType>,
    firstSnapshot: snapshots[0],
    lastSnapshot: snapshots[snapshots.length - 1]
  }
}

export async function executeQuery<DbModelType extends DocumentData>(collection: CollectionReference<DbModelType, DbModelType> | Collection, options?: FirestoreQueryOptions<DbModelType>): Promise<QueryDocumentSnapshot<DbModelType, DbModelType>[]> {
  try {
    const queryObj = buildQuery(collection, options);
    const querySnapshot = await queryFirestore(queryObj);
    return querySnapshot.docs;
  } catch {
    throw Error("Failed to execute query");
  }
}

export async function executeAggregationQuery<DbModelType extends DocumentData>(collection: CollectionReference<DbModelType, DbModelType> | Collection, options: AggregationQueryOptions<DbModelType>): Promise<{ [key: string]: number | null }> {
  try {
    const { aggregations, ...queryOptions } = options;
    const queryObj = buildQuery(collection, queryOptions);
    const aggregationObj: { [key: string]: AggregateField<number | null> } = {};
    aggregations.forEach(agg => {
      if (agg.operation === 'count') { aggregationObj[agg.aggregateFieldName] = count(); }
      else if (agg.operation === 'sum') { aggregationObj[agg.aggregateFieldName] = sum(agg.sourceFieldPath); }
      else if (agg.operation === 'avg') { aggregationObj[agg.aggregateFieldName] = average(agg.sourceFieldPath); }
    })
    const aggregateSnapshot = await getAggregateFromServer(queryObj, aggregationObj);
    return aggregateSnapshot.data();
  } catch {
    throw Error("Failed to execute aggregation");
  }
}