"use client"
import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';

interface User {
  address: string;
}

interface Session {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

const SessionContext = createContext<Session | undefined>(undefined);

async function fetchSession(): Promise<Session> {
  const response = await fetch('/api/auth/me');
  const data = await response.json();
  return {
    isAuthenticated: data.isAuthenticated,
    user: data.user || null,
    isLoading: false,
  };
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    refetchOnWindowFocus: false,
  });

  const value = {
    isAuthenticated: data?.isAuthenticated || false,
    user: data?.user || null,
    isLoading,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
