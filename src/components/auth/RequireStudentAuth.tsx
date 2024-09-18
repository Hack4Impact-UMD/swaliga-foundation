import { redirect } from 'next/navigation'
import AuthProvider, { useAuth } from './AuthProvider';
import { Role } from '@/types/user-types';

export default function RequireStudentAuth({ children }: { children: JSX.Element }): JSX.Element {
  const authContext = useAuth();
  if (authContext.loading) {
    return <p>Loading</p>
  } else if (!authContext.user) {
    redirect('/');
  }

  const role = authContext.token?.claims?.role;
  switch (role) {
    case undefined:
      redirect("/");
    case Role.REGISTERING:
      redirect("/create-account");
    case Role.ADMIN:
      redirect("/admin-dashboard");
    default:
      break;
  }

  return <AuthProvider>{children}</AuthProvider>;
};
