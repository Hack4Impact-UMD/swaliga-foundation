"use client";

import RequireAuth from "@/features/auth/RequireAuth";
import ResetPasswordPage from "./ResetPasswordPage";

export default function ResetPasswordPageWrapper() {
  return (
    <RequireAuth allowedRoles={[]} allowUnauthenticated>
      <ResetPasswordPage />
    </RequireAuth>
  );
}
