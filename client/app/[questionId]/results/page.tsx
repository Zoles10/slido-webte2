"use client";
import React, { useState, useEffect } from "react";
import Logo from "@/components/logo";
import LogoutButton from "@/components/ui/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";
import { Paragraph, TypographyH2 } from "@/components/ui/typography/typography";
import ResultsView from "./results-view"; // Ensure this component is ready to display the structure
import { Loader2 } from "lucide-react";
import { apiUrl } from "@/utils/config";
import Link from "next/link";
import LanguageSwitcher from "@/components/ui/languageSwitcher";

async function getDataQuestion(questionId: string) {
  const response = await fetch(apiUrl + "question/" + questionId);
  if (!response.ok) {
    throw new Error("Failed to fetch question data");
  }
  return response.json();
}

async function getAnswers(questionId: string) {
  const response = await fetch(apiUrl + "answer/" + questionId);
  if (!response.ok) {
    throw new Error("Failed to fetch answers");
  }
  return response.json();
}

async function getHistoricAnswers(questionId: string) {
  const response = await fetch(
    apiUrl + "archivedQuestionAnswers/" + questionId
  );
  if (!response.ok) {
    throw new Error("Failed to fetch historical answers");
  }
  return response.json();
}

const processAnswers = (answers) => {
  console.log(answers);
  const answerCounts = new Map();
  answers.forEach((item) => {
    item.name.split(";").forEach((answer) => {
      answerCounts.set(answer, (answerCounts.get(answer) || 0) + 1);
    });
  });
  return Array.from(answerCounts, ([name, amount]) => ({
    name,
    amount,
  }));
};

export default function ResultsPage({
  params,
  searchParams,
}: {
  params: { questionId: string };
  searchParams: URLSearchParams;
}) {
  const [apiData, setApiData] = useState(null);
  const [currentAnswers, setCurrentAnswers] = useState([]);
  const [historicData, setHistoricData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      try {
        const questionData = await getDataQuestion(params.questionId);
        const currentAnswersData = await getAnswers(params.questionId);
        const historicalAnswers = await getHistoricAnswers(params.questionId);

        setApiData(questionData);

        // Process current answers
        const processedCurrentAnswers = processAnswers(currentAnswersData);
        setCurrentAnswers(processedCurrentAnswers);

        console.log(historicalAnswers);
        const processedHistoricData = historicalAnswers.map((period) => ({
          from: period.from,
          to: period.to,
          answers: processAnswers(period.answers),
        }));

        setHistoricData(processedHistoricData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, [params.questionId]);

  return (
    <div>
      <header className="flex justify-between items-center w-full p-2">
        <Logo />
        <div className="flex space-x-4">
          <LanguageSwitcher />
          <ModeToggle />
          <LogoutButton />
        </div>
      </header>
      <main className="flex flex-col p-2 items-center">
        <TypographyH2>
          Question Results: {apiData?.question_string}
        </TypographyH2>
        {!loading && apiData ? (
          <>
            <h1 className="text-xl font-bold mt-4">Current results</h1>
            <ResultsView data={currentAnswers} title="Current Voting Results" />
            {historicData.map((data, index) => (
              <div key={index}>
                <h1 className="text-xl font-bold mt-4">
                  {data.from} to {data.to}
                </h1>
                <ResultsView data={data.answers} />
              </div>
            ))}
          </>
        ) : (
          <Loader2 className="animate-spin" />
        )}
        <Link href="/home" legacyBehavior>
          <a className="text-orange-500 hover:underline">Home</a>
        </Link>
      </main>
    </div>
  );
}
