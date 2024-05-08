"use client";
import { useRouter } from "next/navigation";
import { Button } from "./button";

export default function NavigateButton() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/home/createQuestion");
  };

  return (
    <Button
      onClick={() => {
        handleLogout();
      }}
    >
      Vytvoriť otázku
    </Button>
  );
}
