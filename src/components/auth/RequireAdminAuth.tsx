import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

export default function RequireAdminAuth({ children }: { children: JSX.Element }): JSX.Element {
  const authContext = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authContext.loading) {
      if (!authContext.user) {
        router.push('/');
      } else if (authContext.token?.claims?.role !== "ADMIN") {
        router.push('/student-dashboard');
      }
    }
  }, [authContext, router]);

  if (authContext.loading || !authContext.user || authContext.token?.claims?.role !== "ADMIN") {
    return <p>Loading...</p>;
  }

  return children;
}
