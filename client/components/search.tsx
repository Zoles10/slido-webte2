"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { useState } from "react";
import { CircleAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Search() {
  const [isSearching, setIsSearching] = useState(false);
  const [failedSearch, setFailedSearch] = useState(false);

  const handleSearch = (value: number) => {
    setIsSearching(true);
    setTimeout(() => {
      toast("Nepodarilo sa nájsť otázku s týmto kódom", {
        description: "Skúste iný kód alebo kontaktujte organizátora.",
        important: true,
        icon: <CircleAlert className="text-destructive" />,
      });
      setFailedSearch(true);
      setTimeout(() => {
        setFailedSearch(false);
      }, 300);

      setIsSearching(false);
    }, 1000);
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
        onComplete={(value) => {
          handleSearch(parseInt(value));
        }}
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
