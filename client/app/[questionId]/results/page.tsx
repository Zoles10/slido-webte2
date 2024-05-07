import React from "react";
import Logo from "@/components/logo";
import LogoutButton from "@/components/ui/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";
import { Paragraph, TypographyH2 } from "@/components/ui/typography/typography";
import { Result } from "./columns";
import ToggleButton from "./toggle-button";
import WorldCloud from "@/components/ui/word-cloud";
import WordCloud from "@/components/ui/word-cloud";
import ResultsView from "./results-view";
import { Loader2 } from "lucide-react";
import { apiUrl } from "@/utils/config";

async function getDataQuestion(questionId: any) {
  const response = await fetch(apiUrl + "question/" + questionId);
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return response.json();
}

async function getAnswers(questionId: any) {
  return fetch(apiUrl + "answer/" + questionId).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch question");
    }
    return response.json();
  });
}

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: { questionId: string };
  searchParams: {
    cloud: boolean;
  };
}) {
  let apiData = null;
  let data = null;
  let answerList = null;

  try {
    data = await getAnswers(params.questionId);
    console.log("Data answers: ", data);
    answerList = data;
    console.log("Answer List:", answerList);

    apiData = await getDataQuestion(params.questionId);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  const showCloud = searchParams.cloud;
  console.log("Show Cloud:", showCloud);

  return (
    <div>
      <header className="flex justify-between items-center w-full p-2">
        <Logo />
        <div className="flex space-x-4">
          <LogoutButton />
          <ModeToggle />
        </div>
      </header>
      <main className="flex flex-col p-2 items-center">
        <TypographyH2>Question {apiData.question_string} </TypographyH2>
        <Paragraph>This is a question results page</Paragraph>

        {data ? (
          <ResultsView data={answerList} />
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </main>
    </div>
  );
}
