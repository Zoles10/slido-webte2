"use client";
import React, { useState, useEffect } from "react";
import Logo from "@/components/logo";
import LogoutButton from "@/components/ui/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";
import { Paragraph, TypographyH2 } from "@/components/ui/typography/typography";
import ResultsView from "./results-view";
import { Loader2 } from "lucide-react";
import { apiUrl } from "@/utils/config";

async function getDataQuestion(questionId) {
  const response = await fetch(apiUrl + "question/" + questionId);
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return response.json();
}

async function getAnswers(questionId) {
  return fetch(apiUrl + "answer/" + questionId).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch answers");
    }
    return response.json();
  });
}

export default function ResultsPage({ params, searchParams }) {
  const [apiData, setApiData] = useState(null);
  const [answerList, setAnswerList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      try {
        const data = await getAnswers(params.questionId);
        const apiData = await getDataQuestion(params.questionId);

        setApiData(apiData);
        if (apiData.question_type === "multiple_choice") {
          const answerCounts = new Map();
          data.forEach((item) => {
            item.name.split(";").forEach((answer) => {
              answerCounts.set(answer, (answerCounts.get(answer) || 0) + 1);
            });
          });
          const processedAnswers = Array.from(
            answerCounts,
            ([name, amount]) => ({
              name,
              amount,
            })
          );
          console.log("processedAnswers:", processedAnswers);
          setAnswerList(processedAnswers);
        } else {
          setAnswerList(data);
        }
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
          <LogoutButton />
          <ModeToggle />
        </div>
      </header>
      <main className="flex flex-col p-2 items-center">
        <TypographyH2>Question {apiData?.question_string}</TypographyH2>
        <Paragraph>This is a question results page</Paragraph>

        {!loading && apiData ? (
          <ResultsView data={answerList} />
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </main>
    </div>
  );
}
