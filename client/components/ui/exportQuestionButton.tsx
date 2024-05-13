"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { FormattedMessage } from "react-intl";
import { ArrowDownToLine } from "lucide-react";

type ExportProps = {
  questionData: any; // Use a more specific type depending on the structure of your data
  questionOptions: any[];
};

const downloadCSV = (questionData, questionOptions) => {
  // Extract the question string from questionData
  const { question_string: question } = questionData;

  // Start the CSV content with headers
  let csvContent = '"Question";"Answers";"Amount"\n';
  questionOptions.forEach((option, index) => {
    if (index === 0) {
      csvContent += `"${question}";"${option.name}";${option.amount}\n`;
    } else {
      csvContent += `;"${option.name}";${option.amount}\n`;
    }
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "question_data.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const ExportQuestionButton: React.FC<ExportProps> = ({
  questionData,
  questionOptions,
}) => {
  return (
    <Button onClick={() => downloadCSV(questionData, questionOptions)} clas>
      <ArrowDownToLine className="mr-2" />
      <FormattedMessage id="exportQuestion" />
    </Button>
  );
};

export default ExportQuestionButton;
