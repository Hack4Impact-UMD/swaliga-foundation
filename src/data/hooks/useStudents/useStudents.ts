import { useContext } from "react";
import { StudentsContext } from "./StudentsProvider";
import { Student } from "@/types/user-types";

export interface useStudentsReturn {
  students: Student[],
  isLoading: boolean,
  isError: boolean,
}

export const useStudentsDefault: useStudentsReturn = {
  students: [],
  isLoading: false,
  isError: false,
}

export default function useStudents(): useStudentsReturn {
  return useContext(StudentsContext);
}