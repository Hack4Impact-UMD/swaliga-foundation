"use client";

import { resetPassword } from "@/features/auth/authN/emailPasswordAuthN";
import { useSearchParams } from "next/navigation";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");
  switch (mode) {
    case "verifyEmail":
      return <div>Email Verified</div>;
    case "resetPassword":
      return (
        <div onClick={() => resetPassword(oobCode as string, "newPassword")}>
          Reset Password
        </div>
      );
    default:
      return <div>Invalid Mode</div>;
  }
}
