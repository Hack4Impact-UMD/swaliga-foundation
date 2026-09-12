import RequireAuth from "@/features/auth/authN/components/RequireAuth";
import dynamic from "next/dynamic";
import LoadingPage from "../loading";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

const SurveysPage = dynamic(() => import("./SurveysPage"), {
  loading: () => <LoadingPage />,
});

export default function SurveysPageWrapper() {
  return (
    <RequireAuth allowedRoles={["ADMIN", "STAFF"]}>
      <SurveysPage />
    </RequireAuth>
  );
}
