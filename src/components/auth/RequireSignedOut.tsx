import { redirect } from "next/navigation";
import AuthProvider, { useAuth } from "./AuthProvider";
import { auth } from "@/lib/firebase/firebaseConfig";
import { Role } from "@/types/user-types";

export default function RequireSignedOut({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const authContext = useAuth();
  if (authContext.loading) {
    return <p>Loading</p>;
  } else if (authContext.user && authContext.token?.claims?.role) {
    console.log("Signed out" + authContext.token)
    redirect(authContext.token?.claims?.role == Role.ADMIN ? '/admin-dashboard' : '/student-dashboard');
  }

  return <AuthProvider>{children}</AuthProvider>;
}
