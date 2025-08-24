import { useContext } from "react";
import { SurveysContext } from "./SurveysProvider";
import useAuth from "@/features/auth/useAuth";
import { Role } from "@/types/user-types";
import useStudentSurveys from "./useStudentSurveys";
import { SurveyID } from "@/types/survey-types";

export interface useSurveysReturn {
  surveys: SurveyID[];
  isLoading: boolean;
  isError: boolean;
}

export const useSurveysDefault: useSurveysReturn = {
  surveys: [],
  isLoading: false,
  isError: false,
}

export default function useSurveys(surveyIds: string[] = []): useSurveysReturn {
  const auth = useAuth();
  const role = auth.token?.claims.role as Role;

  const adminSurveys = useContext(SurveysContext);
  const studentSurveys = useStudentSurveys(surveyIds, role === "STUDENT");

  if (!role) {
    return { surveys: [], isLoading: false, isError: false };
  }
  return role === "STUDENT" ? studentSurveys : adminSurveys;
}