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
import LanguageSwitcher from "@/components/ui/languageSwitcher";
import ExportQuestionButton from "@/components/ui/exportQuestionButton";
import { Loader2 } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { Checkbox } from "@/components/ui/checkbox";

async function getAnswers(questionId: string) {
  return fetch(apiUrl + "answer/" + questionId).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch answers");
    }
    return response.json();
  });
}

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

function getHistoricAnswers(questionId: string) {
  return fetch(apiUrl + "archivedQuestionAnswers/" + questionId).then(
    (response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch answers");
      }
      return response.json();
    }
  );
}

export default function Page({ params }: { params: { questionId: string } }) {
  const router = useRouter();
  const [answer, setAnswer] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [data, setData] = useState<QuestionData | null>(null);
  const [options, setOptions] = useState<QuestionOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [answerList, setAnswerList] = useState([]);

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
    const fetchData = async () => {
      try {
        // Fetching answers
        const answerData = await getAnswers(params.questionId);
        let processedAnswers = [];
        const historicalAnswers = await getHistoricAnswers(params.questionId);

        if (questionType === "multiple_choice") {
          const answerCounts = new Map();
          answerData.forEach((item: any) => {
            item.name.split(";").forEach((answer: string) => {
              answerCounts.set(answer, (answerCounts.get(answer) || 0) + 1);
            });
          });
          processedAnswers = Array.from(answerCounts, ([name, amount]) => ({
            name,
            amount,
          }));
          console.log("processedAnswers:", processedAnswers);
        } else {
          processedAnswers = answerData; // Assuming 'answerData' already structured as needed
        }
        setAnswerList(processedAnswers);

        // Fetching question data and options if needed
        const data = await getDataQuestion(params.questionId);
        console.log("Data:", data);
        setData(data);
        setQuestion(data.question_string);
        setQuestionType(data.question_type);

        if (data.question_type === "multiple_choice") {
          const options = await getQuestionOptions(data.question_id);
          console.log("Options:", options);
          setOptions(options);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false); // Ensure loading is set to false after all operations
      }
    };

    // Call the async function
    fetchData();
  }, [params.questionId, questionType]); // Ensure all dependencies are listed

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
    <div className="h-screen">
      <header className="flex flex-col sm:flex-row justify-between items-center w-full p-2">
        <Logo />
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <LanguageSwitcher />
          <ModeToggle />
          <LogoutButton />
        </div>
      </header>
      {loading ? (
        <div className="flex flex-col items-center">
          {" "}
          <h1>
            <FormattedMessage id="loadingQuestion" />
          </h1>
          <Loader2 />{" "}
        </div>
      ) : (
        <main className="flex flex-col p-2 items-center justify-center">
          <TypographyH2>{question}</TypographyH2>

          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            {data?.question_type === "open_end" && (
              <Input
                type="text"
                placeholder="Answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={loading}
              />
            )}
            <div className="flex flex-col px-10 mt-5">
              {data?.question_type === "multiple_choice" &&
                !options.message &&
                options?.map((option) => (
                  <div
                    key={option.question_option_id}
                    className="flex flex-row mb-5 items-center justify-start"
                  >
                    <Checkbox
                      id={String(option.question_option_id)}
                      // checked={field.value}
                      onCheckedChange={(checked: any) =>
                        handleCheckboxChange(option.option_string, checked)
                      }
                      className="w-7 h-7 mr-2"
                      disabled={loading}
                    />
                    <label htmlFor={String(option.question_option_id)}>
                      {option.option_string}
                    </label>
                  </div>
                ))}
            </div>
            <Button
              type="submit"
              style={{ marginTop: "1rem", marginBottom: "1rem" }}
              disabled={loading}
            >
              {loading ? (
                <FormattedMessage id="submitting" />
              ) : (
                <FormattedMessage id="submit" />
              )}
            </Button>
            {error && <Paragraph className="text-red-500">{error}</Paragraph>}
          </form>
          <div className="flex flex-row items-center">
            <Link href={`/${params.questionId}/results`}>
              <Button className="mr-4">
                <FormattedMessage id="goToResults" />
              </Button>
            </Link>
            <ExportQuestionButton
              questionData={data}
              questionOptions={answerList}
            />
          </div>
          <div className="mt-4 text-center">
            <Link href="/home" legacyBehavior>
              <a className="text-orange-500 hover:underline">
                <FormattedMessage id="home" />
              </a>
            </Link>
          </div>
        </main>
      )}
    </div>
  );
}
