import { ModeToggle } from "@/components/mode-toggle";
import LoginForm from "./view/login_form";
import { Dancing_Script } from "next/font/google";
const dancingScript = Dancing_Script({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="absolute top-2 left-4">
        <h1 className={dancingScript.className + " text-6xl font-bold"}>
          Slid.in
        </h1>
      </div>
      <div className="absolute top-2  right-2 ">
        <ModeToggle />
      </div>
      <LoginForm />
    </main>
  );
}
