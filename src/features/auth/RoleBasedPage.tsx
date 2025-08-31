import { Role } from "@/types/user-types";
import { JSX } from "react";
import useAuth from "./useAuth";
import ErrorPage from "@/app/error";

interface RoleBasedPageProps {
  rolePages: Partial<Record<Role, JSX.Element | (() => JSX.Element)>>;
  unauthenticatedPage?: JSX.Element | (() => JSX.Element);
  noRolePage?: JSX.Element | (() => JSX.Element);
}

export default function RoleBasedPage(props: RoleBasedPageProps) {
  const { rolePages, unauthenticatedPage, noRolePage } = props;
  const auth = useAuth();
  const role: Role = auth.token?.claims.role as Role;

  if (!auth.user && unauthenticatedPage) {
    return unauthenticatedPage instanceof Function
      ? unauthenticatedPage()
      : unauthenticatedPage;
  } else if (!role && noRolePage) {
    return noRolePage instanceof Function ? noRolePage() : noRolePage;
  } else if (rolePages[role]) {
    return rolePages[role] instanceof Function
      ? rolePages[role]()
      : rolePages[role];
  }
  return <ErrorPage error="We're unable to find the page you're looking for." />;
}
