import { redirect } from "next/navigation";
import AuthProvider, { useAuth } from "./AuthProvider";

export default function RequireStudentAuth({
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
    return (
      <div>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return <AuthProvider>{children}</AuthProvider>;
}
