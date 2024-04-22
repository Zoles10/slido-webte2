"use client";
import API from "@/lib/axios";
import { createContext, useContext, useState, ReactNode } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // try {
    //   const response = await API.post<{ token: string; user: User }>("/login", {
    //     email,
    //     password,
    //   });
    //   const { token, user } = response.data;
    //   localStorage.setItem("jwtToken", token);
    //   setUser(user);
    // } catch (error) {
    //   console.error("Login failed:", error);
    //   throw error;
    // }

    //dummy
    const user = { id: 1, name: "John Doe", email: "x@x.sk" };
    setUser(user);
    localStorage.setItem("jwtToken", "dummy");
    document.cookie = `jwtToken=${"dummy"}; path=/; max-age=3600; secure; SameSite=None`;
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    document.cookie =
      "jwtToken=; path = /; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
