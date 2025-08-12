import { Role } from "@/types/user-types";
import useAuth from "./useAuth";

interface RequireAuthProps {
  children: JSX.Element;
  allowedRoles: Role[];
  allowUnauthenticated?: boolean;
  allowNoRole?: boolean;
}

export default function RequireAuth(props: RequireAuthProps) {
  const {
    children,
    allowedRoles,
    allowUnauthenticated = false,
    allowNoRole,
  } = props;
  const auth = useAuth();

  if (
    (allowUnauthenticated && !auth.user) ||
    (allowNoRole && !auth.token?.claims.role) ||
    allowedRoles.includes(auth.token?.claims.role as Role)
  ) {
    return children;
  }

  throw Error("You do not have permission to access this page.");
}
