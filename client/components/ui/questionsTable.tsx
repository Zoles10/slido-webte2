import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Question } from '@/app/home/myQuestions/page';
import { useAuth } from '../auth/auth_provider';
import { apiUrl } from '@/utils/config';
import { FormattedMessage } from 'react-intl';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface QuestionTableProps {
  all: boolean;
  itemsPerPage?: number;
}

async function fetchQuestions(): Promise<Question[]> {
  try {
    const response = await fetch(apiUrl + "question");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    return [];
  }
}

const QuestionTable: React.FC<QuestionTableProps> = ({ all, itemsPerPage = 10 }) => {
  const { user,isAdmin } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const loadQuestions = async () => {
      const fetchedQuestions = await fetchQuestions();
      const questionsListWithSpecificUser = fetchedQuestions.filter(
        (question) => question.user_id == user?.id
      );
      let filteredQuestions = fetchedQuestions;
      if (!all) {
        filteredQuestions = questionsListWithSpecificUser;
      }
      setQuestions(filteredQuestions);
      setTotalPages(Math.ceil(filteredQuestions.length / itemsPerPage));
    };

    loadQuestions();
  }, [all]); // Ensure to reload when 'all' changes if it affects data

  const indexLastQuestion = currentPage * itemsPerPage;
  const indexFirstQuestion = indexLastQuestion - itemsPerPage;
  const currentQuestions = questions.slice(indexFirstQuestion, indexLastQuestion);

  // Function to render the pagination controls
  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <PaginationItem key={number} active={number === currentPage}>
          <PaginationLink onClick={() => setCurrentPage(number)}>
            {number}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return (
      <Pagination>
        <PaginationPrevious onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage <= 1}>
          Previous
        </PaginationPrevious>
        <PaginationContent>
          {items}
        </PaginationContent>
        <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPages}>
          Next
        </PaginationNext>
      </Pagination>
    );
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><FormattedMessage id="question" /></TableHead>
            <TableHead><FormattedMessage id="topic" /></TableHead>
            <TableHead><FormattedMessage id="dateOfCreation" /></TableHead>
            <TableHead><FormattedMessage id="code" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.length > 0 ? (
            questions.map((question) => (
              <TableRow key={question.question_id}>
                <TableCell>{question.question_string}</TableCell>
                <TableCell>{question.topic}</TableCell>
                <TableCell>
                  {new Date(question.created_at).toLocaleDateString()}
                </TableCell>
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
          
      {renderPagination()}
    </div>
  );
};

export default QuestionTable;
