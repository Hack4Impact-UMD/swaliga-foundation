import { Role } from "@/types/user-types";
import { JSX } from "react";
import useAuth from "./useAuth";

interface RoleBasedPageProps {
  rolePages: Partial<Record<Role, JSX.Element>>;
  unauthenticatedPage?: JSX.Element;
}

export default function RoleBasedPage(props: RoleBasedPageProps) {
  const { rolePages, unauthenticatedPage } = props;
  const auth = useAuth();
  const role: Role = auth.token?.claims.role as Role;

  if (!role && unauthenticatedPage) {
    return unauthenticatedPage;
  } else if (rolePages[role]) {
    return rolePages[role];
  }
  throw Error("We're unable to find the page you're looking for.");
}
