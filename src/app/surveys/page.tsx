import RequireAuth from "@/features/auth/RequireAuth";
import dynamic from "next/dynamic";
import LoadingPage from "../loading";

const SurveysPage = dynamic(() => import("./SurveysPage"), { loading: () => <LoadingPage /> });

export default function SurveysPageWrapper() {
  return (
    <RequireAuth allowedRoles={["ADMIN", "STAFF"]}>
      <SurveysPage />
    </RequireAuth>
  );
}
