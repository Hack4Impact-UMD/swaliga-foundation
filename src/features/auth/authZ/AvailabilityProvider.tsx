"use client";

import LoadingPage from "@/app/loading";
import { functions } from "@/config/firebaseConfig";
import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import useAuth from "../authN/components/useAuth";
import { Role } from "@/types/user-types";
import InvalidRefreshTokenPage from "@/app/InvalidRefreshTokenPage";
import ErrorPage from "@/app/error";

interface AvailabilityProviderProps {
  children: React.ReactNode;
}

export default function AvailabilityProvider(props: AvailabilityProviderProps) {
  const { children } = props;

  const auth = useAuth();
  const role = auth.token?.claims.role as Role;

  const [isRefreshTokenValid, setIsRefreshTokenValid] = useState<boolean>(
    !role
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (!role) {
      setIsRefreshTokenValid(true);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    httpsCallable(functions, "checkRefreshTokenValidity")()
      .then((result) => setIsRefreshTokenValid(result.data as boolean))
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, [role]);

  if (isLoading) {
    return <LoadingPage />;
  } else if (isError) {
    return <ErrorPage error="We ran into an unexpected error. Please try again later." />;
  } else if (!isRefreshTokenValid) {
    return <InvalidRefreshTokenPage />;
  }
  return children;
}
