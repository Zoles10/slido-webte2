"use client";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { FormattedMessage } from "react-intl";

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
      <FormattedMessage id="myQuestions" />
    </Button>
  );
}
