import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

export default function RequireStudentAuth({ children }: { children: JSX.Element }): JSX.Element {
  const authContext = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authContext.loading) {
      if (!authContext.user) {
        router.push('/');
      } else if (authContext.token?.claims?.role !== "STUDENT") {
        router.push('/admin-dashboard');
      }
    }
  }, [authContext.loading, authContext.user, authContext.token?.claims?.role, router]);

  if (authContext.loading) {
    return <p>Loading...</p>;
  }

  return children;
}
