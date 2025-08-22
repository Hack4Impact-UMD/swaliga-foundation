import { AssignmentID } from "@/types/survey-types";
import { useEffect, useState } from "react";
import {
  getAssignmentsByStudentId,
  getAssignmentsBySurveyId,
} from "../firestore/assignments";

type useAssignmentsParams = { studentId: string } | { surveyId: string };

export default function useAssignments(params: useAssignmentsParams) {
  // @ts-expect-error
  const { studentId, surveyId } = params;
  const [assignments, setAssignments] = useState<AssignmentID[]>([]);

  useEffect(() => {
    (studentId
      ? getAssignmentsByStudentId(studentId)
      : getAssignmentsBySurveyId(surveyId)
    ).then((assignments) => setAssignments(assignments));
  }, [studentId, surveyId]);

  return { assignments, setAssignments };
}
