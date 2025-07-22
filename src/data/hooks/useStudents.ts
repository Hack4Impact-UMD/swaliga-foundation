import { useContext } from "react";
import { StudentsContext } from "./StudentsProvider";

export default function useStudents() {
  const { students } = useContext(StudentsContext);
  return students;
}