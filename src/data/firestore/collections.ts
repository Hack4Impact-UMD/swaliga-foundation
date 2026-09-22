export const enum Collection {
  ADMIN_DATA = "adminData",
  STUDENTS = "students",
  SURVEYS = "surveys",
  METADATA = "metadata",
  CLUBS = "clubs",
  GOOGLE_OAUTH2_TOKENS = "googleOAuth2Tokens",
  USERS = "users",
  USERNAMES = "usernames"
}

export const enum StudentsSubcollection {
  SURVEY_ACCESS_LIST = "surveyAccessList"
}

export const enum SurveysSubcollection {
  ASSIGNMENTS = "assignments",
}

export const enum ClubsSubcollection {
  PROGRAMS = "programs"
}

export const enum AdminDataSubcollection {
  STUDENTS = "students",
  SURVEYS = "surveys"
}

export const enum MetadataDocument {
  NEXT_STUDENT_ID = "nextStudentId"
}