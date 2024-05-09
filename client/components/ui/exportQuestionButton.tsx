"use client";
import React from 'react';
import { Button } from '@/components/ui/button';

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

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create a link and trigger the download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'question_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const ExportQuestionButton: React.FC<ExportProps> = ({ questionData, questionOptions }) => {
  return (
    <Button onClick={() => downloadCSV(questionData, questionOptions)}>
      Export Question
    </Button>
  );
};

export default ExportQuestionButton;
