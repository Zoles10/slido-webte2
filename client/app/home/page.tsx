"use client";
import { useAuth } from "@/components/auth/auth_provider";
import Logo from "@/components/logo";
import LogoutButton from "@/components/ui/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import NavigateButton from "@/components/ui/navigateButton";
import { Label } from "@/components/ui/label";
import Search from "@/components/search";
import NavigateMyQuestions from "@/components/ui/navigateMyQuestions";

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <header className="flex justify-between items-center w-full p-2">
        <Logo />
        <div className="flex space-x-4">
          <LogoutButton />
          <ModeToggle />
          <NavigateButton />
          <NavigateMyQuestions />
        </div>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-center  space-y-10">
        <h1 className="text-2xl font-bold">
          Vitajte {user?.email ?? "John doe"}
        </h1>
        <p className="text-lg">Ste na domovskej obrazovke</p>
        <div className="w-11/12 sm:w-2/3 text-center space-y-2 ">
          <Label>Nemáte QR kód? Vyhľadajte otázku podľa kódu</Label>
          <Search />
        </div>
      </main>
    </>
  );
}
