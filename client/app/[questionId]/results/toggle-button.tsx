"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ToggleButton({ showCloud }: { showCloud: boolean }) {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        console.log("click", showCloud);
        router.push(`?cloud=${!showCloud}`);
        router.refresh;
      }}
    >
      Toggle cloud
    </Button>
  );
}
