"use client";
import React, { useState, useEffect } from "react";
import Logo from "@/components/logo";
import LogoutButton from "@/components/ui/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Paragraph, TypographyH2 } from "@/components/ui/typography/typography";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { apiUrl } from "@/utils/config";
import { useRouter } from "next/navigation";
import internal from "stream";

type QuestionOption = {
  question_option_id: number;
  question_id: number;
  option_string: string;
  correct: boolean;
};

type QuestionData = {
  question_string: string;
  question_type: string;
  question_id: number;
};

function getAnswer(questionId: string) {
  return fetch(apiUrl + "answer/" + questionId).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch question");
    }
    return response.json();
  });
}

function getDataQuestion(questionId: string) {
  return fetch(apiUrl + "question/" + questionId).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    return response.json();
  });
}

function getQuestionOptions(questionId: string) {
  return fetch(apiUrl + "question/" + questionId + "/options").then(
    (response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch question options");
      }
      return response.json();
    }
  );
}

function postAnswer(questionId: string, answer: string) {
  return getAnswer(questionId).then((data) => {
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
  });
}

export default function Page({ params } : { params: { questionId: string } }) {
  const router = useRouter();
  const [answer, setAnswer] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [data, setData] = useState<QuestionData | null>(null);
  const [options, setOptions] = useState<QuestionOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleCheckboxChange = (optionString: string, isChecked: boolean) => {
    setLoading(true);
    let newSelectedOptions = [...selectedOptions];
    if (isChecked) {
      newSelectedOptions = [...newSelectedOptions, optionString];
    } else {
      newSelectedOptions = newSelectedOptions.filter(
        (opt) => opt !== optionString
      );
    }
    setSelectedOptions(newSelectedOptions);
    setAnswer(newSelectedOptions.join(";"));
    console.log("Selected options:", answer);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getDataQuestion(params.questionId)
      .then((data) => {
        console.log("Data:", data);
        setData(data);
        setQuestion(data.question_string);
        if (data.question_type === "multiple_choice") {
          getQuestionOptions(data.question_id)
            .then((options) => {
              console.log("Options:", options);
              setOptions(options);
              setLoading(false);
            })
            .catch((error) => {
              setError(
                "Failed to load the question options. Please try again."
              );
              setLoading(false);
            });
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load the question. Please try again.");
        setLoading(false);
      });
  }, [params.questionId]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    postAnswer(params.questionId, answer)
      .then((apiResponse) => {
        console.log("Response:", apiResponse);
        router.push(`/${params.questionId}/results`);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error posting answer:", error.message);
        setError("Failed to submit answer. Please try again.");
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
        <TypographyH2>{question}</TypographyH2>
        <form onSubmit={handleSubmit}>
          {data?.question_type === "open" && (
            <Input
              type="text"
              placeholder="Answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={loading}
            />
          )}
          {data?.question_type === "multiple_choice" &&
            options.map((option) => (
              <div key={option.question_option_id}>
                <input
                  type="checkbox"
                  id={String(option.question_option_id)}
                  onChange={(e) =>
                    handleCheckboxChange(option.option_string, e.target.checked)
                  }
                  disabled={loading}
                />
                <label htmlFor={String(option.question_option_id)}>
                  {option.option_string}
                </label>
              </div>
            ))}
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
        <div className="mt-4 text-center">
          <Link href="/home" legacyBehavior>
            <a className="text-orange-500 hover:underline">Return to home</a>
          </Link>
        </div>
      </main>
    </div>
  );
}
