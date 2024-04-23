import Logo from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Label } from "@/components/ui/label";
import LoginButton from "@/components/ui/loginButton";
import Search from "@/components/search";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center  space-y-10">
      <div className="absolute top-2  right-2 flex flex-row gap-1  items-center">
        <Label>Nie ste prihlásený</Label>
        <LoginButton />
        <ModeToggle />
      </div>
      <Logo />
      <div className="w-11/12 sm:w-2/3 text-center space-y-2 ">
        <Label>Nemáte QR kód? Vyhľadajte otázku podľa kódu</Label>
        <Search />
      </div>
    </main>
  );
}
