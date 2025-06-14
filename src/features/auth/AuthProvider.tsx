"use client";
import {
  onIdTokenChanged,
  User,
  IdTokenResult,
  getIdTokenResult,
} from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth, functions } from "@/config/firebaseConfig";
import { httpsCallable } from "firebase/functions";
import LoadingPage from "@/app/loading";

interface AuthContextType {
  user: User | null;
  token: IdTokenResult | null;
  loading: boolean;
  error: string;
}

export const AuthContext = createContext<AuthContextType>(null!);

export default function AuthProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<IdTokenResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (newUser) => {
      setLoading(true);
      setUser(newUser);
      if (newUser) {
        try {
          let newToken = await newUser.getIdTokenResult();
          if (newToken.claims.email_verified && !newToken.claims?.role) {
            await httpsCallable(functions, "setAdminRole")();
            newToken = await getIdTokenResult(newUser, true);
          }
          setToken(newToken);
          setError("");
        } catch (error) {
          setError("An unexpected error occurred. Please try again.");
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}
