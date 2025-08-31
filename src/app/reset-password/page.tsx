import RequireAuth from "@/features/auth/RequireAuth";
import dynamic from "next/dynamic";
import LoadingPage from "../loading";

const SendResetPasswordEmailPage = dynamic(() => import("./SendResetPasswordEmailPage"), { loading: () => <LoadingPage /> });

export default function ResetPasswordPageWrapper() {
  return (
    <RequireAuth allowedRoles={[]} allowUnauthenticated>
      <SendResetPasswordEmailPage />
    </RequireAuth>
  );
}
