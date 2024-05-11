"use client";
import React from "react";
import Logo from "@/components/logo";
import LogoutButton from "@/components/ui/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";
import QuestionTable from "@/components/ui/questionsTable";
import QuestionsSwitch from "@/components/ui/questionsSwitch";
import { FormattedMessage } from "react-intl";
import LanguageSwitcher from "@/components/ui/languageSwitcher";
import { useAuth } from "@/components/auth/auth_provider";

export type Question = {
  question_string: any;
  topic: any;
  created_at: any;
  user_id: any;
  question_id: any;
  code: any;
};
export default function MyQuestions({
  searchParams,
}: {
  searchParams: {
    all: string;
  };
}) {
  const { isAdmin } = useAuth();
  return (
    <>
      <header className="flex justify-between items-center w-full p-2">
        <Logo />
        <div className="flex space-x-4">
          <LanguageSwitcher />
          <ModeToggle />
          <LogoutButton />
        </div>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 ">
        <div className="w-full max-w-2xl p-8 shadow-lg rounded-lg">
          {isAdmin && <QuestionsSwitch all={searchParams.all === "true"} />}

          <h1 className="text-2xl font-bold text-center">
            <FormattedMessage id="myQuestions" />
          </h1>
          <QuestionTable all={searchParams.all == "true"} />
          <div
            className="mt-4 text-center text-orange-500 hover:underline  cursor-pointer"
            onClick={() => {
              window.location.href = "/home";
            }}
          >
            <FormattedMessage id="home" />
          </div>
        </div>
      </main>
    </>
  );
}
