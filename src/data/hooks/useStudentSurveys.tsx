import { SurveyID } from "@/types/survey-types";
import { useEffect, useState } from "react";
import { getSurveyById } from "../firestore/surveys";

export default function useStudentSurveys(
  surveyIds: string[],
  enabled: boolean
) {
  const [surveys, setSurveys] = useState<SurveyID[]>([]);

  useEffect(() => {
    if (!enabled) return;
    const promises = surveyIds.map((id) => getSurveyById(id));
    Promise.all(promises).then((results) => setSurveys(results));
  }, [surveyIds, enabled]);

  return surveys;
}
