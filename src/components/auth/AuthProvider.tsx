'use client';
import {
  onIdTokenChanged,
  type User,
  type IdTokenResult,
} from "@firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase/firebaseConfig";

interface AuthContextType {
  user: User;
  token: IdTokenResult;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export default function AuthProvider({children}: {children: JSX.Element}): JSX.Element {
  const [user, setUser] = useState<User | any>(null!);
  const [token, setToken] = useState<IdTokenResult>(null!);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    onIdTokenChanged(auth, (newUser) => {
      setUser(newUser);
      if (newUser != null) {
        newUser
          .getIdTokenResult()
          .then((newToken) => {
            setToken(newToken);
          })
          .catch(() => {});
      }
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
};
