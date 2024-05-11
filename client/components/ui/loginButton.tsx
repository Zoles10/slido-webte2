"use client";

import { useRouter } from "next/navigation";
import { Button } from "./button";
import { useAuth } from "../auth/auth_provider";

export default function LoginButton() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleClick = () => {
    router.push("/login");
    router.refresh();
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  return !user ? (
    <Button onClick={handleClick}> Prihlásiť</Button>
  ) : (
    <Button onClick={handleLogout}>Odhlásiť </Button>
  );
}
