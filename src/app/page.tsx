"use client";

import RequireAuth from "@/features/auth/RequireAuth";
import RoleBasedPage from "@/features/auth/RoleBasedPage";
import LoginPage from "./LoginPage";

export default function LoginPageWrapper() {
  return (
    <RequireAuth allowedRoles={[]} allowUnauthenticated>
      <RoleBasedPage rolePages={{}} unauthenticatedPage={<LoginPage />} />
    </RequireAuth>
  );
}
