"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/auth_provider";
import { Button } from "./button";
import { FormattedMessage } from "react-intl";

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
      <FormattedMessage id="logout" defaultMessage="Odhlásiť sa" />
    </Button>
  );
}
