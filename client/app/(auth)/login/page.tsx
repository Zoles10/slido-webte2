import Link from "next/link";
import LoginForm from "../../../components/auth/login_form";
import { Paragraph } from "@/components/ui/typography/typography";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <LoginForm />
    </main>
  );
}
