"use client";

import RequireAuth from "@/features/auth/authN/components/RequireAuth";
import RoleBasedPage from "@/features/auth/authN/components/RoleBasedPage";
import useAuth from "@/features/auth/authN/components/useAuth";
import dynamic from "next/dynamic";
import LoadingPage from "./loading";

const StudentPage = dynamic(
  () => import("./students/[studentId]/StudentPage"),
  { loading: () => <LoadingPage /> }
);
const CreateAccountPage = dynamic(
  () => import("../features/accountManagement/components/CreateAccountPage"),
  { loading: () => <LoadingPage /> }
);
const LoginPage = dynamic(() => import("./LoginPage"), {
  loading: () => <LoadingPage />,
});

export default function LoginPageWrapper() {
  const auth = useAuth();
  const studentId = auth.token?.claims.studentId as string;

  return (
    <RequireAuth allowedRoles={["STUDENT"]} allowUnauthenticated>
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
      />
    </RequireAuth>
  );
}
