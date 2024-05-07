import Link from "next/link";
import QuestionForm from "@/components/questions/question_form";
import { Paragraph } from "@/components/ui/typography/typography";
import Logo from "@/components/logo";
import LogoutButton from "@/components/ui/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";

export default function CreateQuestion() {
  return (
    <>
      <header className="flex justify-between items-center w-full p-2">
        <Logo />
        <div className="flex space-x-4">
          <LogoutButton />
          <ModeToggle />
        </div>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-center p-24 ">
        <div className="w-full max-w-2xl p-8 shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center">
            Create a New Question
          </h1>
          <Paragraph>Fill out the form below to post a new question.</Paragraph>
          <QuestionForm />
          <div className="mt-4 text-center">
            <Link href="/" legacyBehavior>
              <a className="text-blue-500 hover:underline">Return to home</a>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
