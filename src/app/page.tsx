"use client";

import RequireAuth from "@/features/auth/RequireAuth";
import RoleBasedPage from "@/features/auth/RoleBasedPage";
import LoginPage from "./LoginPage";
import useAuth from "@/features/auth/useAuth";
import SendVerificationEmailPage from "./SendVerificationEmailPage";
import StudentPage from "./students/[studentId]/StudentPage";
import CreateAccountPage from "./create-account/CreateAccountPage";

export default function LoginPageWrapper() {
  const auth = useAuth();
  const studentId = auth.token?.claims.studentId as string;

  return (
    <RequireAuth allowedRoles={["STUDENT"]} allowUnauthenticated allowNoRole>
      <RoleBasedPage
        rolePages={{
          STUDENT: () =>
            studentId ? (
              <StudentPage studentId={studentId} />
            ) : (
              <CreateAccountPage />
            ),
        }}
        unauthenticatedPage={<LoginPage />}
        noRolePage={<SendVerificationEmailPage />}
      />
    </RequireAuth>
  );
}
