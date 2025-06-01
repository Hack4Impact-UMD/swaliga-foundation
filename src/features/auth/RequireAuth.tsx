import { Role } from "@/types/user-types";
import useAuth from "./useAuth";

interface RequireAuthProps {
  children: JSX.Element;
  allowedRoles: Role[];
  allowUnauthenticated?: boolean;
}

export default function RequireAuth(props: RequireAuthProps) {
  const { children, allowedRoles, allowUnauthenticated = false } = props;
  const auth = useAuth();

  if (
    (allowUnauthenticated && !auth.user) ||
    allowedRoles.includes(auth.token?.claims.role as Role)
  ) {
    return children;
  }

  throw Error("You do not have permission to access this page.");
}
