import RequireAuth from "@/features/auth/RequireAuth";
import StudentsPage from "./StudentsPage";

export default function StudentsPageWrapper() {
  return (
    <RequireAuth allowedRoles={["ADMIN", "STAFF"]}>
      <StudentsPage />
    </RequireAuth>
  );
}
