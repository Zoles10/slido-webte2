"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { apiUrl } from "@/utils/config";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
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
          console.log("login", data);
          localStorage.setItem("token", data.jwt);
          localStorage.setItem("refreshToken", data.refreshToken);
          localStorage.setItem("user_id", JSON.stringify(data.user_id));
          document.cookie = `jwtToken=${data.jwt}; path=/; max-age=3600; secure; SameSite=None`;
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
          console.log("User logged in:", userData); // Now this will log the updated user
          router.push("/home");
          router.refresh();
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
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user_id");
    document.cookie =
      "jwtToken=; path = /; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
  };

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) {
      return;
    }

    //get user
    await fetch(apiUrl + "user/" + userId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.user_id) {
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
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     // router.push("/home");
  //     // router.refresh();
  //     console.log("User logged in:", user); // Now this will log the updated user
  //   }
  // }, [isAuthenticated, user, router]);
  
  const changePassword = async (oldPassword: string, newPassword: string) => {
    const username = user?.email;
    if (!username) {
      throw new Error("User not authenticated");
    }
    const response = await fetch(apiUrl + "password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ username, new_password: newPassword }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to change password");
    }
    return data;
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout,changePassword, isAuthenticated, isAdmin }}
    >
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
