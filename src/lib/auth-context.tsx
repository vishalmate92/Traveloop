import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, isMockMode } from './firebase';

interface AuthContextType {
  user: FirebaseUser | any | null;
  loading: boolean;
  isMock: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, isMock: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isMockMode) {
      const savedUser = localStorage.getItem('traveloop_mock_user');
      setUser(savedUser ? JSON.parse(savedUser) : null);
      setLoading(false);
      return;
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isMock: isMockMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
