import RequireAuth from "@/features/auth/RequireAuth";
import dynamic from "next/dynamic";

const StudentsPage = dynamic(() => import("./StudentsPage"));

export default function StudentsPageWrapper() {
  return (
    <RequireAuth allowedRoles={["ADMIN", "STAFF"]}>
      <StudentsPage />
    </RequireAuth>
  );
}
