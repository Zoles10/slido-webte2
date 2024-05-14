import Link from "next/link";
import LoginForm from "../../../components/auth/login_form";
import { Paragraph } from "@/components/ui/typography/typography";
import ChangePasswordForm from "@/components/auth/changePassword_form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <ChangePasswordForm />
    </main>
  );
}
