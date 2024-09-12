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

    if (role === Role.REGISTERING) {
      redirect("/create-account");
    } else {
      redirect(role === Role.ADMIN ? '/admin-dashboard' : '/student-dashboard');
    }
  }

  return <AuthProvider>{children}</AuthProvider>;
}
