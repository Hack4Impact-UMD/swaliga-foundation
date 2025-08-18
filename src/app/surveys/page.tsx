import RequireAuth from "@/features/auth/RequireAuth";
import SurveysPage from "./SurveysPage";

export default function SurveysPageWrapper() {
  return (
    <RequireAuth allowedRoles={["ADMIN", "STAFF"]}>
      <SurveysPage />
    </RequireAuth>
  );
}
