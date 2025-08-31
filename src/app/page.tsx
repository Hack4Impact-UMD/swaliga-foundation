"use client";

import RequireAuth from "@/features/auth/RequireAuth";
import RoleBasedPage from "@/features/auth/RoleBasedPage";
import useAuth from "@/features/auth/useAuth";
import dynamic from "next/dynamic";
import LoadingPage from "./loading";

const StudentPage = dynamic(
  () => import("./students/[studentId]/StudentPage"),
  { loading: () => <LoadingPage /> }
);
const CreateAccountPage = dynamic(
  () => import("./create-account/CreateAccountPage"),
  { loading: () => <LoadingPage /> }
);
const LoginPage = dynamic(() => import("./LoginPage"), {
  loading: () => <LoadingPage />,
});
const SendVerificationEmailPage = dynamic(
  () => import("./SendVerificationEmailPage"),
  { loading: () => <LoadingPage /> }
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
