import PasswordForm from "@/components/auth/password_form";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="absolute top-2  right-2 flex flex-row gap-1 ">
        <ModeToggle />
      </div>
      <PasswordForm />
    </main>
  );
}
