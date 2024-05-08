"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Question } from "@/app/home/myQuestions/page";
import { useAuth } from "../auth/auth_provider";

interface QuestionTableProps {
  questions: Question[];
  all: boolean;
}

const QuestionTable: React.FC<QuestionTableProps> = ({ questions, all }) => {
  const { user } = useAuth();

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
        {questions.map(
          (question) =>
            ((all && question.user_id === user?.id) || !all) && (
              <TableRow key={question.question_id}>
                <TableCell>{question.question_string}</TableCell>
                <TableCell>{question.topic}</TableCell>
                <TableCell>
                  {new Date(question.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{question.code}</TableCell>
              </TableRow>
            )
        )}
      </TableBody>
    </Table>
  );
};

export default QuestionTable;
