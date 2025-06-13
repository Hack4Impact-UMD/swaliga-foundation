"use client";

import RequireAuth from "@/features/auth/RequireAuth";
import RoleBasedPage from "@/features/auth/RoleBasedPage";
import LoginPage from "./LoginPage";
import useAuth from "@/features/auth/useAuth";
import SendVerificationEmailPage from "./SendVerificationEmailPage";

export default function LoginPageWrapper() {
  const auth = useAuth();
  if (auth.token && !auth.token?.claims.email_verified) {
    return <SendVerificationEmailPage />;
  }

  return (
    <RequireAuth allowedRoles={[]} allowUnauthenticated>
      <RoleBasedPage rolePages={{}} unauthenticatedPage={<LoginPage />} />
    </RequireAuth>
  );
}
