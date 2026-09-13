import LoadingPage from "@/app/loading";
import RequireAuth from "@/features/auth/authN/components/RequireAuth";
import dynamic from "next/dynamic";

const SurveyPage = dynamic(() => import("./SurveyPage"), {
  loading: () => <LoadingPage />,
});

export default async function SurveyPageWrapper(
  props: {
    params: Promise<{ surveyId: string }>;
  }
) {
  const params = await props.params;
  const { surveyId } = params;
  return (
    <RequireAuth allowedRoles={["ADMIN", "STAFF"]}>
      <SurveyPage surveyId={surveyId} />
    </RequireAuth>
  );
}
