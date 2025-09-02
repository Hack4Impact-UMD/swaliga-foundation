import RequireAuth from "@/features/auth/authN/components/RequireAuth";
import dynamic from "next/dynamic";
import LoadingPage from "@/app/loading";

const StudentPage = dynamic(() => import("./StudentPage"), {
  loading: () => <LoadingPage />,
});

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
