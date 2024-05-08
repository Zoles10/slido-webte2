import React from "react";
import Logo from "@/components/logo";
import LogoutButton from "@/components/ui/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";
import QuestionTable from "@/components/ui/questionsTable";
import QuestionsSwitch from "@/components/ui/questionsSwitch";
import Link from "next/link";

export type Question = {
  question_string: any;
  topic: any;
  created_at: any;
  user_id: any;
  question_id: any;
  code: any;
};
export default async function MyQuestions({
  searchParams,
}: {
  searchParams: {
    all: string;
  };
}) {
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
          <QuestionsSwitch all={searchParams.all == "true"} />

          <h1 className="text-2xl font-bold text-center">Moje otázky</h1>
          <QuestionTable all={searchParams.all == "true"} />
          <div className="mt-4 text-center">
            <Link href="/home" legacyBehavior>
              <a className="text-orange-500 hover:underline">Domov</a>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
