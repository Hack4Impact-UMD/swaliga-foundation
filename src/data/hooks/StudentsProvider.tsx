"use client";

import React, { createContext, useEffect, useState } from "react";
import { Role, Student } from "@/types/user-types";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { Collection } from "../firestore/utils";
import { db } from "@/config/firebaseConfig";
import LoadingPage from "@/app/loading";
import useAuth from "@/features/auth/useAuth";
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
            collection(db, Collection.STUDENTS),
            (snapshot) => {
              setStudents(snapshot.docs.map((doc) => doc.data() as Student));
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
