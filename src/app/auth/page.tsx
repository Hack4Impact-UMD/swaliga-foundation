"use client";

import { useSearchParams } from "next/navigation";
import EmailVerifiedPage from "./EmailVerifiedPage";

export default function AuthHandlerPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  switch (mode) {
    case "verifyEmail":
      return <EmailVerifiedPage />;
    default:
      throw new Error("We're unable to find the page you're looking for.");
  }
}
