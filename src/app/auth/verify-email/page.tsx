"use client";

import useAuth from "@/features/auth/useAuth";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function VerifyEmailPage() {
  const auth = useAuth();
  useEffect(() => {
    auth.user?.getIdToken(true);
  }, []);
  return <div onClick={() => redirect("/")}>Return to Home Page</div>;
}
