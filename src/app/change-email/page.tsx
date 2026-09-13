import RequireAuth from "@/features/auth/authN/components/RequireAuth";
import SendChangeEmailLinkPage from "./SendChangeEmailLinkPage";

export default function ChangeEmailPageWrapper() {
  return (
    <RequireAuth allowedRoles={["STUDENT", "ADMIN"]}>
      <SendChangeEmailLinkPage />
    </RequireAuth>
  );
}
