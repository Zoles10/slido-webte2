"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CircleAlert, Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export default function Search() {
  const [isSearching, setIsSearching] = useState(false);
  const [failedSearch, setFailedSearch] = useState(false);
  const router = useRouter();

  const handleSearch = async (value: string) => {
    setIsSearching(true);

    try {
      // Replace the URL with your API endpoint and include the ID in the query
      const response = await fetch(
        `https://node98.webte.fei.stuba.sk/slido-webte2/server/api/activeQuestion/${value}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data.question_id) {
        setIsSearching(false);
        router.push("/" + value);
        router.refresh();
        return;
      } else {
        toast("Nepodarilo sa nájsť otázku s týmto kódom", {
          description: "Skúste iný kód alebo kontaktujte organizátora.",
          important: true,
          icon: <CircleAlert className="text-destructive" />,
        });
        setFailedSearch(true);
        setTimeout(() => {
          setFailedSearch(false);
        }, 300);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast("Nepodarilo sa nájsť otázku s týmto kódom", {
        description: "Skúste iný kód alebo kontaktujte organizátora.",
        important: true,
        icon: <CircleAlert className="text-destructive" />,
      });
      setFailedSearch(true);
      setTimeout(() => {
        setFailedSearch(false);
      }, 300);
    }

    setIsSearching(false);
  };

  return (
    <div className="space-y-2">
      <InputOTP
        maxLength={5}
        className="items-center justify-center"
        pattern={REGEXP_ONLY_DIGITS}
        containerClassName={
          "justify-center " + (failedSearch && " animate-shake")
        }
        onComplete={handleSearch}
        disabled={isSearching}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
        </InputOTPGroup>
      </InputOTP>
      {isSearching && (
        <div className="text-center flex items-center justify-center">
          <Loader2 className="w-6 h-6 mr-2 animate-spin" />
          Vyhľadávam...
        </div>
      )}
    </div>
  );
}
