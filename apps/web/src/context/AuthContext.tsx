"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type React from "react";

import { toast } from "sonner";

// import { useToast } from '../components/ui/Toast';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  // const { addToast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("nestify_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, name: string = "User") => {
    const newUser = { email, name };
    setUser(newUser);
    localStorage.setItem("nestify_user", JSON.stringify(newUser));
    toast.success(`Welcome back, ${name}!`);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("nestify_user");
    toast.info("Signed out successfully");
  };

  return <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>{children}</AuthContext.Provider>;
};
