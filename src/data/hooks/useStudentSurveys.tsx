import { SurveyID } from "@/types/survey-types";
import { useEffect, useState } from "react";
import { getSurveyById } from "../firestore/surveys";
import { useSurveysReturn } from "./useSurveys";

export default function useStudentSurveys(
  surveyIds: string[],
  enabled: boolean
): useSurveysReturn {
  const [surveys, setSurveys] = useState<SurveyID[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (!enabled) return;
    setIsLoading(true);
    const promises = surveyIds.map((id) => getSurveyById(id));
    Promise.all(promises)
      .then((results) => setSurveys(results))
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, [surveyIds, enabled]);

  return { surveys, isLoading, isError };
}
