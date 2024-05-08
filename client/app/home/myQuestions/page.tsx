import React from "react";
import Logo from "@/components/logo";
import LogoutButton from "@/components/ui/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";
import QuestionTable from "@/components/ui/questionsTable";
import QuestionsSwitch from "@/components/ui/questionsSwitch";

export type Question = {
  question_string: any;
  topic: any;
  created_at: any;
  user_id: any;
  question_id: any;
  code: any;
};

async function fetchQuestions(): Promise<Question[]> {
  const response = await fetch(
    "https://node98.webte.fei.stuba.sk/slido-webte2/server/api/question"
  );
  const data = await response.json();
  return data;
}

export default async function MyQuestions({
  searchParams,
}: {
  searchParams: {
    all: string;
  };
}) {
  const questions = await fetchQuestions();
  console.log(searchParams.all);

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

          <h1 className="text-2xl font-bold text-center">My questions</h1>
          <QuestionTable
            questions={questions}
            all={searchParams.all == "true"}
          />
        </div>
      </main>
    </>
  );
}
