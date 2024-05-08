"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Question } from "@/app/home/myQuestions/page";
import { useAuth } from "../auth/auth_provider";

interface QuestionTableProps {
  all: boolean;
}

async function fetchQuestions(): Promise<Question[]> {
  try {
    const response = await fetch("https://node98.webte.fei.stuba.sk/slido-webte2/server/api/question");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return [];
  }
}

const QuestionTable: React.FC<QuestionTableProps> = ({ all }) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const loadQuestions = async () => {
      const fetchedQuestions = await fetchQuestions();
      setQuestions(fetchedQuestions);
    };

    loadQuestions();
  }, [all]);  // This dependency might be unnecessary unless fetching depends on 'all'

 
  const questionsListWithSpecificUser = questions.filter(question => question.user_id == user?.id);
    let filteredQuestions = questions;
    if (!all) {
       filteredQuestions = questionsListWithSpecificUser;
    }
  


  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Question</TableHead>
          <TableHead>Topic</TableHead>
          <TableHead>Date Asked</TableHead>
          <TableHead>Code</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <TableRow key={question.question_id}>
              <TableCell>{question.question_string}</TableCell>
              <TableCell>{question.topic}</TableCell>
              <TableCell>{new Date(question.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{question.code}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4}>No questions found</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default QuestionTable;

