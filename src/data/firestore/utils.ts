import { FieldValue } from "firebase/firestore";

export enum Collection {
  ADMIN_DATA = "adminData",
  STUDENTS = "students",
  SURVEYS = "surveys",
  ASSIGNMENTS = "assignments",
  METADATA = "metadata",
}

export enum Document {
  LAST_UPDATED = "lastUpdated",
  NEXT_STUDENT_ID = "nextStudentId",
  SURVEYS = "surveys",
  STUDENTS = "students",
}

export type FirestorePartial<T> = {
  [P in keyof T]?: T[P] | FieldValue;
}