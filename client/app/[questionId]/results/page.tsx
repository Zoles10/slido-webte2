"use client";
import React, { useState, useEffect } from "react";
import Logo from "@/components/logo";
import LogoutButton from "@/components/ui/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";
import { TypographyH2 } from "@/components/ui/typography/typography";
import ResultsView from "./results-view"; // Ensure this component is ready to display the structure
import { Loader2 } from "lucide-react";
import { apiUrl } from "@/utils/config";
import Link from "next/link";
import LanguageSwitcher from "@/components/ui/languageSwitcher";
import { FormattedMessage } from "react-intl";

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
  console.log(response);
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

// const processAnswers = (answers: any) => {
//   console.log(answers);
//   const answerCounts = new Map();
//   answers.forEach((item: any) => {
//     item.name.split(";").forEach((answer: any) => {
//       answerCounts.set(answer, (answerCounts.get(answer) || 0) + 1);
//     });
//   });
//   return Array.from(answerCounts, ([name, amount]) => ({
//     name,
//     amount,
//   }));
// };

export default function ResultsPage({
  params,
  searchParams,
}: {
  params: { questionId: string };
  searchParams: URLSearchParams;
}) {
  const [apiData, setApiData] = useState<any>(null);
  const [currentAnswers, setCurrentAnswers] = useState([]);
  const [historicData, setHistoricData] = useState([]);
  const [loading, setLoading] = useState(true);

  const processAnswers = (answers: any) => {
    const answerCounts = new Map();
    answers.forEach((answer: any) => {
      const colors = answer.name.split(";");
      colors.forEach((color: any) => {
        answerCounts.set(color, (answerCounts.get(color) || 0) + answer.amount);
      });
    });
    return Array.from(answerCounts, ([name, amount]) => ({
      name,
      amount,
    }));
  };

  useEffect(() => {
    async function loadResults() {
      try {
        const questionData = await getDataQuestion(params.questionId);
        const currentAnswersData = await getAnswers(params.questionId);
        const historicalAnswers = await getHistoricAnswers(params.questionId);

        setApiData(questionData);

        const processedCurrentAnswers: any = processAnswers(currentAnswersData);
        setCurrentAnswers(processedCurrentAnswers);

        const processedHistoricData = historicalAnswers.map((period: any) => ({
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

  function formatTimestamp(timestamp: any) {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  }

  return (
    <div>
      <header className="flex flex-col sm:flex-row justify-between items-center w-full p-2">
        <Logo />
        <div className="flex space-x-4 mt-4">
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
            <ResultsView data={currentAnswers} />
            {historicData.map((data: any, index) => (
              <div key={index}>
                <h1 className="text-3xl font-bold mt-4">
                  <FormattedMessage id="poll" />
                  {" " + (index + 1)}
                </h1>
                <h1 className="text-xl font-bold mt-2">
                  <div className="text-orange-500">
                    <FormattedMessage id="from" />
                  </div>
                  {formatTimestamp(data.from)}{" "}
                  <div className="text-orange-500">
                    <FormattedMessage id="to" />
                  </div>{" "}
                  {formatTimestamp(data.to)}
                </h1>
                {data.note && (
                  <h1 className="text-xl font-bold mt-4">Note {data.note}</h1>
                )}
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
