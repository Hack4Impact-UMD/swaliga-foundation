"use client";

import { useSearchParams } from "next/navigation";
import EmailVerifiedPage from "./EmailVerifiedPage";
import ResetPasswordPage from "./ResetPasswordPage";

export default function AuthHandlerPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  switch (mode) {
    case "verifyEmail":
      return <EmailVerifiedPage />;
    case "resetPassword":
      const oobCode = searchParams.get("oobCode");
      if (!oobCode) {
        throw new Error("We're unable to find the page you're looking for.");
      }
      return <ResetPasswordPage oobCode={oobCode} />;
    default:
      throw new Error("We're unable to find the page you're looking for.");
  }
}
