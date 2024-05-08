"use client";
import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import Logo from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import LoginButton from "@/components/ui/loginButton";
import { apiUrl } from "@/utils/config"; // Ensure you have the base URL for your API

export default function Home({ params }: any) {
  const [url, setUrl] = useState(`https://localhost:3000/${params.questionId}`);
  const [question, setQuestion] = useState({ title: "", topic: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(`${apiUrl}question/${params.questionId}`);
        if (!response.ok) throw new Error("Failed to fetch question details");
        const data = await response.json();
        setQuestion({
          title: data.question_string,
          topic: data.topic,
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [params.questionId]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="absolute top-2 right-2 flex flex-row gap-1 items-center">
        <ModeToggle />
      </div>
      <Logo />
      <div className="flex flex-col w-full max-w-4xl p-5">
        {loading ? (
          <p>Loading question details...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <>
            <div className="text-left mb-8">
              <p className="text-orange-500">Otázka</p>
              <h2 className="text-5xl font-bold">{question.title}</h2>
              <p className="text-orange-500 mt-5">Predmet</p>
              <p className="text-3xl">{question.topic}</p>
            </div>
            <div className="flex justify-center">
              <QRCode value={url} size={500} level={"H"} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
