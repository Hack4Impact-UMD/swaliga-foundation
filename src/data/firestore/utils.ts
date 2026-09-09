import { FieldValue } from "firebase/firestore";

export const enum Collection {
  ADMIN_DATA = "adminData",
  STUDENTS = "students",
  SURVEYS = "surveys",
  ASSIGNMENTS = "assignments",
  SURVEY_ACCESS_LIST = "surveyAccessList",
  METADATA = "metadata",
  CLUBS = "clubs"
}

export const enum Document {
  NEXT_STUDENT_ID = "nextStudentId",
  SURVEYS = "surveys",
  STUDENTS = "students",
  SURVEY_ACCESS_LIST = "surveyAccessList"
}

export type FirestorePartial<T> = {
  [P in keyof T]?: T[P] | FieldValue;
}