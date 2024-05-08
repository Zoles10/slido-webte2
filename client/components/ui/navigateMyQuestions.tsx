"use client";
import { useRouter } from "next/navigation";
import { Button } from "./button";

export default function NavigateButton() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/home/myQuestions");
  };

  return (
    <Button
      onClick={() => {
        handleLogout();
      }}
    >
      Moje otázky
    </Button>
  );
}
