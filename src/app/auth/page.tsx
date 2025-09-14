"use client";

import { useSearchParams } from "next/navigation";
import RequireAuth from "@/features/auth/authN/components/RequireAuth";
import { checkCodeValidity } from "@/features/auth/authN/emailPasswordAuthN";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ErrorPage from "../error";
import LoadingPage from "../loading";
import { ActionCodeInfo } from "firebase/auth";

const VerifyEmailPage = dynamic(() => import("./VerifyEmailPage"), {
  loading: () => <LoadingPage />,
});
const ResetPasswordPage = dynamic(() => import("./ResetPasswordPage"), {
  loading: () => <LoadingPage />,
});
const ChangeEmailPage = dynamic(() => import("./ChangeEmailPage"), {
  loading: () => <LoadingPage />,
});

export default function AuthHandlerPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");
  if (!mode || !oobCode) {
    return (
      <ErrorPage error="We're unable to find the page you're looking for." />
    );
  }

  const [actionCodeInfo, setActionCodeInfo] = useState<ActionCodeInfo>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    checkCodeValidity(oobCode)
      .then((result) => {
        setActionCodeInfo(result);
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
    return <ErrorPage error={error} />;
  }

  switch (mode) {
    case "verifyEmail":
      return (
        <RequireAuth allowedRoles={["STUDENT"]} allowNoRole>
          <VerifyEmailPage oobCode={oobCode} />
        </RequireAuth>
      );
    case "resetPassword":
      return (
        <RequireAuth allowedRoles={[]} allowUnauthenticated>
          <ResetPasswordPage oobCode={oobCode} />
        </RequireAuth>
      );
    case "verifyAndChangeEmail":
    case "recoverEmail":
      return (
        <RequireAuth allowedRoles={["STUDENT"]}>
          <ChangeEmailPage oobCode={oobCode} actionCodeInfo={actionCodeInfo} />
        </RequireAuth>
      );
    default:
      return (
        <ErrorPage error="We're unable to find the page you're looking for." />
      );
  }
}
