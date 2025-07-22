"use client";

import useAuth from "@/features/auth/useAuth";
import { Role } from "@/types/user-types";
import StudentsProvider from "./StudentsProvider";
import SurveysProvider from "./SurveysProvider";

interface DataProviderProps {
  children: React.ReactNode;
}

export default function DataProvider({ children }: DataProviderProps) {
  const role = useAuth().token?.claims.role as Role;

  switch (role) {
    case "ADMIN":
      return (
        <SurveysProvider>
          <StudentsProvider>{children}</StudentsProvider>
        </SurveysProvider>
      );
    default:
      return children;
  }
}
