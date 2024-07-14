'use client';
import {
  onIdTokenChanged,
  User,
  IdTokenResult,
} from "@firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase/firebaseConfig";

interface AuthContextType {
  user: User | null;
  token: IdTokenResult | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export default function AuthProvider({children}: {children: JSX.Element}): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<IdTokenResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (newUser) => {
      setUser(newUser);
      if (newUser) {
        const newToken = await newUser.getIdTokenResult(true); // Force refresh the token
        setToken(newToken);
      } else {
        setToken(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
