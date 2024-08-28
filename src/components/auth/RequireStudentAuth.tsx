import { redirect } from 'next/navigation'
import AuthProvider, { useAuth } from './AuthProvider';

export default function RequireStudentAuth({ children }: { children: JSX.Element }): JSX.Element {
  const authContext = useAuth();
  console.log(authContext.token?.claims.role==="STUDENT")
  console.log(authContext);
  if (authContext.loading) {
    return <p>Loading</p>
  } else if (!authContext.user) {
    redirect('/');
  } else if (authContext.token?.claims?.role != "STUDENT") {
    console.log("Student" + authContext.token)
    redirect('/admin-dashboard');
  }

  return <AuthProvider>{children}</AuthProvider>;
};
