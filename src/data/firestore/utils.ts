import { FieldValue } from "firebase/firestore";

export enum Collection {
  ADMIN_DATA = "adminData",
  STUDENTS = "students",
  SURVEYS = "surveys",
  ASSIGNMENTS = "assignments",
  ACCESS_LIST = "accessList",
  METADATA = "metadata",
}

export enum Document {
  NEXT_STUDENT_ID = "nextStudentId",
  SURVEYS = "surveys",
  STUDENTS = "students",
  SURVEY_ACCESS_LIST = "surveyAccessList"
}

export type FirestorePartial<T> = {
  [P in keyof T]?: T[P] | FieldValue;
}