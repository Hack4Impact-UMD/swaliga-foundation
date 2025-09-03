import { AssignmentID } from "@/types/survey-types";
import { useEffect, useState } from "react";
import {
  getAssignmentsByStudentId,
  getAssignmentsBySurveyId,
} from "../../firestore/assignments";

type useAssignmentsParams = { studentId: string } | { surveyId: string };

interface useAssignmentsReturn {
  assignments: AssignmentID[];
  setAssignments: React.Dispatch<React.SetStateAction<AssignmentID[]>>;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export default function useAssignments(
  params: useAssignmentsParams
): useAssignmentsReturn {
  // @ts-expect-error
  const { studentId, surveyId } = params;
  const [assignments, setAssignments] = useState<AssignmentID[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [refetchToggle, setRefetchToggle] = useState<boolean>(false);

  const refetch = () => setRefetchToggle((prev) => !prev);

  useEffect(() => {
    (studentId
      ? getAssignmentsByStudentId(studentId)
      : getAssignmentsBySurveyId(surveyId)
    )
      .then((assignments) => setAssignments(assignments))
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, [studentId, surveyId, refetchToggle]);

  return { assignments, setAssignments, isLoading, isError, refetch };
}
