import Logo from "@/components/logo";
import LogoutButton from "@/components/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <>
      <header className="flex justify-between items-center w-full p-2">
        <Logo />
        <div className="flex space-x-4">
          <LogoutButton />
          <ModeToggle />
        </div>
      </header>
      <main className="flex  flex-col items-center justify-center p-24"></main>
    </>
  );
}
