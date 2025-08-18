import RequireAuth from "@/features/auth/RequireAuth";
import StudentPage from "./StudentPage";

export default function StudentPageWrapper({
  params,
}: {
  params: { studentId: string };
}) {
  return (
    <RequireAuth allowedRoles={["ADMIN", "STAFF", "STUDENT"]}>
      <StudentPage studentId={params.studentId} />
    </RequireAuth>
  );
}
