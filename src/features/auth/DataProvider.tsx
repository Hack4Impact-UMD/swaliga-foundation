"use client";

import useAuth from "./useAuth";
import SurveysProvider from "@/data/hooks/SurveysProvider";
import StudentsProvider from "@/data/hooks/StudentsProvider";

interface DataProviderProps {
  children: React.ReactNode;
}

export default function DataProvider(props: DataProviderProps) {
  const { children } = props;
  const auth = useAuth();
  const role = auth.token?.claims.role;
  if (role === "ADMIN" || role === "STAFF") {
    return (
      <SurveysProvider>
        <StudentsProvider>{children}</StudentsProvider>
      </SurveysProvider>
    );
  }
  return children;
}
