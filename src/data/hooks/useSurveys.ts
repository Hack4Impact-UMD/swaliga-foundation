import { useContext } from "react";
import { SurveysContext } from "./SurveysProvider";
import useAuth from "@/features/auth/useAuth";
import { Role } from "@/types/user-types";
import useStudentSurveys from "./useStudentSurveys";

export default function useSurveys(surveyIds: string[] = []) {
  const auth = useAuth();
  const role = auth.token?.claims.role as Role;

  const { surveys: adminSurveys } = useContext(SurveysContext);
  const studentSurveys = useStudentSurveys(surveyIds, role === "STUDENT");

  if (!role) {
    return [];
  }
  return role === "STUDENT" ? studentSurveys : adminSurveys;
}