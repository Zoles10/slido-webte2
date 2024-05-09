"use client";
import API from "@/lib/axios";
import { createContext, useContext, useState, ReactNode } from "react";
import { apiUrl } from "@/utils/config";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { set } from "react-hook-form";

type User = {
  id: number;
  email: string;
  name?: string;
  lastname?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setRole] = useState(false);

  const login = async (email: string, password: string) => {
    fetch(apiUrl + "login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          localStorage.setItem("token", data.jwt);
          localStorage.setItem("refreshToken", data.refreshToken);
          document.cookie = `jwtToken=${data.token}; path=/; max-age=3600; secure; SameSite=None`;
          console.log("Login successful:", data);
          const userData: User = {
            id: data.user_id,
            email: data.email,
            name: data.name,
            lastname: data.lastname,
          };
          setUser(userData);
          setIsAuthenticated(true);
          if (data.role == "admin") {
            setRole(true);
          }
        } else {
          throw new Error(data.error || "Login failed");
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    document.cookie =
      "jwtToken=; path = /; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
      router.refresh();
      console.log("User logged in:", user); // Now this will log the updated user
    }
  }, [isAuthenticated, user, router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated,isAdmin }}>
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
