"use client";

import { useRouter } from "next/navigation";
import { Button } from "./button";

export default function LoginButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/login");
    router.refresh();
  };

  return <Button onClick={handleClick}>Prihlásiť</Button>;
}
