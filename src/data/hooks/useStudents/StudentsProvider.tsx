"use client";

import React, { createContext, useEffect, useState } from "react";
import { getFullName, Role, Student } from "@/types/user-types";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { Collection, Document } from "../../firestore/utils";
import { db } from "@/config/firebaseConfig";
import LoadingPage from "@/app/loading";
import useAuth from "@/features/auth/authN/components/useAuth";
import { useStudentsDefault, useStudentsReturn } from "./useStudents";

export const StudentsContext =
  createContext<useStudentsReturn>(useStudentsDefault);

export default function StudentsProvider({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}): JSX.Element {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const auth = useAuth();
  const role: Role = auth.token?.claims.role as Role;

  useEffect(() => {
    if (!role || (role === "STUDENT" && !auth.token?.claims.studentId)) {
      setStudents([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe =
      role === "STUDENT"
        ? onSnapshot(
            doc(
              db,
              Collection.STUDENTS,
              auth.token?.claims.studentId as string
            ),
            (doc) => {
              setStudents([doc.data() as Student]);
              setIsLoading(false);
            },
            () => {
              setIsLoading(false);
              setIsError(true);
            }
          )
        : onSnapshot(
            collection(
              db,
              Collection.ADMIN_DATA,
              Document.STUDENTS,
              Collection.STUDENTS
            ),
            (snapshot) => {
              const newStudents: Student[] = [];
              for (const doc of snapshot.docs) {
                for (const [_, student] of Object.entries(doc.data())) {
                  newStudents.push(student as Student);
                }
              }
              setStudents(
                newStudents.sort((a: Student, b: Student) =>
                  getFullName(a.name).localeCompare(getFullName(b.name))
                )
              );
              setIsLoading(false);
            },
            () => {
              setIsLoading(false);
              setIsError(true);
            }
          );
    return () => unsubscribe();
  }, [role, auth.token?.claims.studentId]);

  return (
    <StudentsContext.Provider value={{ students, isLoading, isError }}>
      {children}
    </StudentsContext.Provider>
  );
}
