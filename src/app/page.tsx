"use client";

import RequireAuth from "@/features/auth/RequireAuth";
import RoleBasedPage from "@/features/auth/RoleBasedPage";
import useAuth from "@/features/auth/useAuth";
import dynamic from "next/dynamic";

const StudentPage = dynamic(() => import("./students/[studentId]/StudentPage"));
const CreateAccountPage = dynamic(
  () => import("./create-account/CreateAccountPage")
);
const LoginPage = dynamic(() => import("./LoginPage"));
const SendVerificationEmailPage = dynamic(
  () => import("./SendVerificationEmailPage")
);

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
