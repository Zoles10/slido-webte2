// "use client" ensures that the component will be compiled and executed only in the browser.
"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Logo from "@/components/logo";
import LogoutButton from "@/components/ui/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Paragraph, TypographyH2 } from "@/components/ui/typography/typography";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { apiUrl } from "@/utils/config";

function getAnswer(questionId: any) {
  return fetch(apiUrl + "answer/" + questionId).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch question");
    }
    return response.json();
  });
}

async function getDataQuestion(questionId: any) {
  const response = await fetch(apiUrl + "question/" + questionId);
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return response.json();
}

async function postAnswer(questionId: any, answer: string) {
  const data = await getAnswer(questionId);
  const user = data.user_id;
  return fetch(apiUrl + "answer/" + questionId, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answer_string: answer, code: questionId }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to post answer");
    }
    return response.json();
  });
}

export default async function Page({
  params,
}: {
  params: { questionId: string };
}) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const data = await getDataQuestion(params.questionId);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    postAnswer(params.questionId, answer)
      .then((apiResponse) => {
        console.log("Response:", apiResponse);
      })
      .catch((error) => {
        console.error("Error posting answer:", error);
        setError("Failed to submit answer. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
        <TypographyH2>{data.question_string}</TypographyH2>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            style={{ marginTop: "1rem", marginBottom: "1rem" }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Answer"}
          </Button>
          {error && <Paragraph className="text-red-500">{error}</Paragraph>}
        </form>
        <Link href={`/${params.questionId}/results`}>
          <Button>Go to results</Button>
        </Link>
      </main>
    </div>
  );
}
