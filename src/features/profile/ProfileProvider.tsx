"use client";

import React, { createContext, useEffect, useState } from "react";
import LoadingPage from "@/app/loading";
import { Student } from "@/types/user-types";
import { getStudentById } from "@/data/firestore/students";
import useAuth from "../auth/authN/components/useAuth";

export interface ProfileContextType {
  student: Student | null;
  isLoading: boolean;
  error: string;
}

export const ProfileContext = createContext<ProfileContextType>({
  student: null,
  isLoading: false,
  error: "",
});

export default function ProfileProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element {
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const auth = useAuth();
  const studentId = auth.token?.claims.studentId as string | undefined

  useEffect(() => {
    if (!studentId) { return; }
    setIsLoading(true);

    const fetchStudent = async () => await getStudentById(studentId)
    
    fetchStudent().then((data) => {
      setStudent(data);
      setIsLoading(false);
      setError("");
    }).catch((err) => {
      setIsLoading(false);
      setError("We were unable to fetch your profile. Please try again later.");
    })
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <ProfileContext.Provider value={{ student, isLoading, error }}>
      {children}
    </ProfileContext.Provider>
  );
}
