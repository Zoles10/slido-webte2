"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QuestionForm from "@/components/questions/question_form";
import { Paragraph } from "@/components/ui/typography/typography";
import Logo from "@/components/logo";
import LogoutButton from "@/components/ui/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";
import { FormattedMessage } from "react-intl";
import LanguageSwitcher from "@/components/ui/languageSwitcher";
import { apiUrl } from "@/utils/config";

export default function CreateEditQuestion({
  params,
}: {
  params: { code: string };
}) {
  const code = params.code;
  console.log(code);

  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (code) {
      fetch(apiUrl + "question/" + code)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          data.active = data.active ? "true" : "false";
          setInitialData(data);
        })
        .catch((error) => console.error("Failed to fetch question", error));

      fetch(apiUrl + "question/" + code + "/getQuestionOptionsByCode")
        .then((response) => response.json())
        .then((data) => {
          setInitialData((prevData: any) => {
            return {
              ...prevData,
              options: data,
            };
          });
        });
    }
  }, [code]);

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
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="w-full max-w-2xl p-8 shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center">
            <FormattedMessage id={"editQuestion"} />
          </h1>
          <Paragraph className="mb-5">
            <FormattedMessage id={"updateQuestionInfo"} />
          </Paragraph>
          <QuestionForm
            initialData={initialData}
            isEditMode={true}
            code={code}
          />
          <Link
            href="/home"
            className="mt-4 text-center text-orange-500 hover:underline cursor-pointer"
          >
            <FormattedMessage id="home" />
          </Link>
        </div>
      </main>
    </>
  );
}
