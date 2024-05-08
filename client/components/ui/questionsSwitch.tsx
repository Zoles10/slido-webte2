"use client";
import { useRouter } from "next/navigation";
import { Switch } from "./switch";

export default function QuestionsSwitch({ all }: { all: boolean }) {
  const router = useRouter();
  return (
    <Switch
      checked={all}
      onCheckedChange={(value) => {
        router.push(`?all=${value}`);
        router.refresh();
      }}
    />
  );
}
