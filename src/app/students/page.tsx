import RequireAuth from "@/features/auth/authN/components/RequireAuth";
import dynamic from "next/dynamic";
import LoadingPage from "../loading";

const StudentsPage = dynamic(() => import("./StudentsPage"), {
  loading: () => <LoadingPage />,
});

export default function StudentsPageWrapper() {
  return (
    <RequireAuth allowedRoles={["ADMIN", "STAFF"]}>
      <StudentsPage />
    </RequireAuth>
  );
}
