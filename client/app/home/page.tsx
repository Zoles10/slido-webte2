"use client";
import { useAuth } from "@/components/auth/auth_provider";
import Logo from "@/components/logo";
import LogoutButton from "@/components/ui/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      <header className="flex justify-between items-center w-full p-2">
        <Logo />
        <div className="flex space-x-4">
          <LogoutButton />
          <ModeToggle />
        </div>
      </header>
      <main className="flex  flex-col p-2">
        <h1 className="text-2xl font-bold">
          Vitajte {user?.name ?? "John doe"}
        </h1>
        <p className="text-lg">Ste na domovskej obrazovke</p>
      </main>
    </>
  );
}
