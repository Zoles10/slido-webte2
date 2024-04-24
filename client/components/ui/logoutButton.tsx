"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/auth_provider";
import { Button } from "./button";

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <Button
      onClick={() => {
        handleLogout();
      }}
    >
      Odhlásiť sa
    </Button>
  );
}
