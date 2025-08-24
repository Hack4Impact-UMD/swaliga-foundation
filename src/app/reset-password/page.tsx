import RequireAuth from "@/features/auth/RequireAuth";
import dynamic from "next/dynamic";

const SendResetPasswordEmailPage = dynamic(() => import("./SendResetPasswordEmailPage"));

export default function ResetPasswordPageWrapper() {
  return (
    <RequireAuth allowedRoles={[]} allowUnauthenticated>
      <SendResetPasswordEmailPage />
    </RequireAuth>
  );
}
