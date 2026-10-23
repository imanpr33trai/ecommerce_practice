"use client";

import { authClient, type Session, type User } from "@/lib/auth-client";
import React, { createContext, useContext, useEffect, useState } from "react";

// Auth context type
interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, callbackUrl?: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, callbackUrl?: string) => Promise<void>;
  signOut: (callbackUrl?: string) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  initialSession?: Session | null;
}

/**
 * AuthProvider - Manages authentication state globally
 * Provides session, user, and auth methods to the entire app
 */
export function AuthProvider({ children, initialSession = null }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [isLoading, setIsLoading] = useState(!initialSession);

  // Get initial session on mount
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await authClient.getSession();
        setSession(data);
      } catch {
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (!initialSession) {
      fetchSession();
    } else {
      setIsLoading(false);
    }
  }, [initialSession]);

  // Listen for auth changes (e.g., from other tabs)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "better-auth.session" || event.key?.startsWith("better-auth.")) {
        // Session might have changed in another tab, refresh
        fetchSession();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const fetchSession = async () => {
    try {
      const { data } = await authClient.getSession();
      setSession(data);
    } catch {
      setSession(null);
    }
  };

  const signIn = async (email: string, password: string, callbackUrl?: string) => {
    const { error } = await authClient.signIn.email(
      { email, password, callbackURL: callbackUrl },
      { onSuccess: () => fetchSession() },
    );
    if (error) throw new Error(error.message);
  };

  const signUp = async (name: string, email: string, password: string, callbackUrl?: string) => {
    const { error } = await authClient.signUp.email(
      { name, email, password, callbackURL: callbackUrl },
      { onSuccess: () => fetchSession() },
    );
    if (error) throw new Error(error.message);
  };

  const signOut = async (_callbackUrl?: string) => {
    const { error } = await authClient.signOut();
    if (!error) {
      setSession(null);
    }
    if (error) throw new Error(error.message);
  };

  const refreshSession = async () => {
    await fetchSession();
  };

  const value: AuthContextType = {
    session,
    user: session?.user ?? null,
    isLoading,
    isAuthenticated: !!session?.user,
    signIn,
    signUp,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Convenience hooks for specific auth needs
export function useSession() {
  const { session, isLoading, refreshSession } = useAuth();
  return { session, isLoading, refreshSession };
}

export function useUser() {
  const { user, isLoading, isAuthenticated } = useAuth();
  return { user, isLoading, isAuthenticated };
}
