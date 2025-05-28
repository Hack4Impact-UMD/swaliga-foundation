import { redirect } from "next/navigation";
import AuthProvider, { useAuth } from "./AuthProvider";
import { Role } from "@/types/user-types";

export default function RequireSignedOut({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const authContext = useAuth();
  if (authContext.loading) {
    return <p>Loading</p>;
  } else if (authContext.user) {
    const role = authContext.token?.claims?.role;
    switch (role) {
      case Role.REGISTERING:
        redirect("/create-account");
      case Role.ADMIN:
        redirect("/admin-dashboard");
      case Role.STUDENT:
        redirect("/student-dashboard");
      default:
        break;
    }
  }

  return <AuthProvider>{children}</AuthProvider>;
}
