import LoadingPage from "@/app/loading";
import RequireAuth from "@/features/auth/RequireAuth";
import dynamic from "next/dynamic";

const SurveyPage = dynamic(() => import("./SurveyPage"), { loading: () => <LoadingPage /> });

export default function SurveyPageWrapper({
  params,
}: {
  params: { surveyId: string };
}) {
  const { surveyId } = params;
  return (
    <RequireAuth allowedRoles={["ADMIN", "STAFF"]}>
      <SurveyPage surveyId={surveyId} />
    </RequireAuth>
  );
}
