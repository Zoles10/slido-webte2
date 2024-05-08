"use client";

import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

// Define the interfaces
interface Question {
  question: string;
  topic: string;
  created_at: string;
  user: string;
  id: string;
  code: string;
}

interface QuestionTableProps {
  questions: Question[];
}

const QuestionTable: React.FC<QuestionTableProps> = ({ questions }) => {
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
          {questions.map((question) => (
            <TableRow key={question.id}>
              <TableCell>{question.question}</TableCell>
              <TableCell>{question.topic}</TableCell>
              <TableCell>{new Date(question.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{question.code}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  
  export default QuestionTable;


