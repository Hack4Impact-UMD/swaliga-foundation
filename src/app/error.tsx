"use client";

import { logOut } from "@/features/auth/authN/googleAuthN";
import useAuth from "@/features/auth/useAuth";
import { Role } from "@/types/user-types";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const auth = useAuth();

  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <p>Current Role: {auth.token?.claims?.role as Role}</p>
      <button onClick={() => logOut()}>Log Out</button>
    </div>
  );
}
