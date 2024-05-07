"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ToggleButton({ showCloud }: { showCloud: boolean }) {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        router.push(`/`);
        router.refresh;
      }}
    >
      Home
    </Button>
  );
}
