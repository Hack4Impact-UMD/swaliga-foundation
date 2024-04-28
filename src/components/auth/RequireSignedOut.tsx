import { redirect } from "next/navigation";
import AuthProvider, { useAuth } from "./AuthProvider";

export default function RequireSignedOut({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const authContext = useAuth();
  if (authContext.loading) {
    return <p>Loading</p>;
  } else if (authContext.user) {
    redirect(authContext.token?.claims?.role == "ADMIN" ? '/admin-dashboard' : '/student-dashboard');
  }

  return <AuthProvider>{children}</AuthProvider>;
}
