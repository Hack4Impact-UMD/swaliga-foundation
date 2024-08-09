import { redirect } from "next/navigation";
import AuthProvider, { useAuth } from "./AuthProvider";

export default function RequireAdminAuth({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const authContext = useAuth();
  if (authContext.loading) {
    return <p>Loading</p>;
  } else if (!authContext.user) {
    redirect("/");
  } else if (authContext.token?.claims?.role != "ADMIN") {
    console.log("Admin" + authContext.token)
    redirect("/student-dashboard");
  }

  return <AuthProvider>{children}</AuthProvider>;
}
