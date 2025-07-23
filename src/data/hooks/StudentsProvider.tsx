"use client";

import React, { createContext, useEffect, useState } from "react";
import { Student } from "@/types/user-types";
import { collection, onSnapshot } from "firebase/firestore";
import { Collection } from "../firestore/utils";
import { db } from "@/config/firebaseConfig";
import LoadingPage from "@/app/loading";

export interface StudentsContextType {
  students: Student[];
}

export const StudentsContext = createContext<StudentsContextType>({
  students: [],
});

export default function StudentsProvider({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}): JSX.Element {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, Collection.STUDENTS),
      (snapshot) => {
        setStudents(snapshot.docs.map((doc) => doc.data()) as Student[]);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <StudentsContext.Provider value={{ students }}>
      {children}
    </StudentsContext.Provider>
  );
}
