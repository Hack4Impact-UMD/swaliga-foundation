import RequireAuth from "@/features/auth/RequireAuth";
import SendResetPasswordEmailPage from "./SendResetPasswordEmailPage";

export default function ResetPasswordPageWrapper() {
  return (
    <RequireAuth allowedRoles={[]} allowUnauthenticated>
      <SendResetPasswordEmailPage />
    </RequireAuth>
  );
}
