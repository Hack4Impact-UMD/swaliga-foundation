import { useContext } from "react";
import { StudentsContext, useStudentsReturn } from "./StudentsProvider";

export default function useStudents(): useStudentsReturn {
  return useContext(StudentsContext);
}