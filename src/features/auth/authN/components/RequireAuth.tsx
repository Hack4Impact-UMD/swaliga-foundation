"use client";

import { Role } from "@/types/user-types";
import useAuth from "./useAuth";
import { useRouter } from "next/navigation";
import LoadingPage from "@/app/loading";

interface RequireAuthProps {
  children: JSX.Element;
  allowedRoles: Role[];
  allowUnauthenticated?: boolean;
  allowNoRole?: boolean;
}

const defaultRedirects: Record<Role | "NO_ROLE" | "UNAUTHENTICATED", string> = {
  UNAUTHENTICATED: "/",
  NO_ROLE: "/",
  STUDENT: "/",
  STAFF: "/students",
  ADMIN: "/students",
};

export default function RequireAuth(props: RequireAuthProps) {
  const {
    children,
    allowedRoles,
    allowUnauthenticated = false,
    allowNoRole,
  } = props;

  const auth = useAuth();
  const role = auth.token?.claims.role as Role | undefined;

  const router = useRouter();

  if (
    (allowUnauthenticated && !auth.user) ||
    (allowNoRole && !auth.token?.claims.role) ||
    allowedRoles.includes(auth.token?.claims.role as Role)
  ) {
    return children;
  }

  if (!auth.user) {
    router.push(defaultRedirects.UNAUTHENTICATED);
  } else if (!role) {
    router.push(defaultRedirects.NO_ROLE);
  } else {
    router.push(defaultRedirects[role]);
  }
  return <LoadingPage />;
}
