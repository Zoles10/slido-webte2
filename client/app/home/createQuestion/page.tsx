"use client";
import Link from "next/link";
import QuestionForm from "@/components/questions/question_form";
import { Paragraph } from "@/components/ui/typography/typography";
import Logo from "@/components/logo";
import LogoutButton from "@/components/ui/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";
import { FormattedMessage } from "react-intl";
import LanguageSwitcher from "@/components/ui/languageSwitcher";

export default function CreateQuestion() {
  return (
    <>
      <header className="flex justify-between items-center w-full p-2 flex-col sm:flex-row">
        <Logo />
        <div className="flex space-x-4 mt-4">
          <LanguageSwitcher />
          <ModeToggle />
          <LogoutButton />
        </div>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 ">
        <div className="w-full max-w-2xl p-8 shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center">
            <FormattedMessage id="createNewQuestion" />
          </h1>
          <Paragraph className="mb-5">
            <FormattedMessage id="fillOutFormAndAddQuestion" />
          </Paragraph>
          <QuestionForm />
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
