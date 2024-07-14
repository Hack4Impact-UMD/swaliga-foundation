import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

export default function RequireSignedOut({ children }: { children: JSX.Element }): JSX.Element {
  const authContext = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authContext.loading) {
      if (authContext.user) {
        if (authContext.token?.claims?.role === "ADMIN") {
          router.push('/admin-dashboard');
        } else if (authContext.token?.claims?.role === "STUDENT") {
          router.push('/student-dashboard');
        }
      }
    }
  }, [authContext, router]);

  if (authContext.loading) {
    return <p>Loading...</p>;
  }

  return children;
}
