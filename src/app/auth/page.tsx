"use client";

import { useSearchParams } from "next/navigation";
import VerifyEmailPage from "./VerifyEmailPage";
import ResetPasswordPage from "./ResetPasswordPage";
import RequireAuth from "@/features/auth/RequireAuth";
import { checkCodeValidity } from "@/features/auth/authN/emailPasswordAuthN";
import { useEffect, useState } from "react";
import LoadingPage from "../loading";

export default function AuthHandlerPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");
  if (!mode || !oobCode) {
    throw new Error("We're unable to find the page you're looking for.");
  }

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    checkCodeValidity(oobCode)
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError("We're unable to find the page you're looking for.");
      });
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    throw new Error(error);
  }

  switch (mode) {
    case "verifyEmail":
      return (
        <RequireAuth allowedRoles={["ADMIN", "STUDENT"]}>
          <VerifyEmailPage oobCode={oobCode} />
        </RequireAuth>
      );
    case "resetPassword":
      return (
        <RequireAuth allowedRoles={[]} allowUnauthenticated>
          <ResetPasswordPage oobCode={oobCode} />
        </RequireAuth>
      );
    default:
      throw new Error("We're unable to find the page you're looking for.");
  }
}
