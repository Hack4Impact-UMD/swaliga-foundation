import RequireAuth from "@/features/auth/RequireAuth";
import dynamic from "next/dynamic";

const SurveysPage = dynamic(() => import("./SurveysPage"));

export default function SurveysPageWrapper() {
  return (
    <RequireAuth allowedRoles={["ADMIN", "STAFF"]}>
      <SurveysPage />
    </RequireAuth>
  );
}
