import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Question } from "@/app/home/myQuestions/page";
import { useAuth } from "../auth/auth_provider";
import { apiUrl } from "@/utils/config";
import { FormattedMessage } from "react-intl";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "./button";
import { useRouter } from "next/navigation";

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
    console.error("Failed to fetch questions:", error);
    return [];
  }
}

const QuestionTable: React.FC<QuestionTableProps> = ({
  all,
  itemsPerPage = 10,
}) => {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [textFilter, setTextFilter] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

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

      filteredQuestions = filteredQuestions.filter((question) => {
        const textMatch = question.question_string
          .toLowerCase()
          .includes(textFilter.toLowerCase());
        const topicMatch = question.topic
          .toLowerCase()
          .includes(topicFilter.toLowerCase());
        const dateMatch = dateFilter
          ? new Date(question.created_at).toLocaleDateString() ===
            new Date(dateFilter).toLocaleDateString()
          : true;

        return textMatch && topicMatch && dateMatch;
      });

      setQuestions(filteredQuestions);
      setTotalPages(Math.ceil(filteredQuestions.length / itemsPerPage));
    };

    loadQuestions();
  }, [all, textFilter, topicFilter, dateFilter]); // Add new dependencies here

  const indexLastQuestion = currentPage * itemsPerPage;
  const indexFirstQuestion = indexLastQuestion - itemsPerPage;
  const currentQuestions = questions.slice(
    indexFirstQuestion,
    indexLastQuestion
  );
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
        <PaginationPrevious
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </PaginationPrevious>
        <PaginationContent>{items}</PaginationContent>
        <PaginationNext
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </PaginationNext>
      </Pagination>
    );
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          marginTop: "20px",
        }}
      >
        <Input
          type="text"
          placeholder="Filter by text"
          value={textFilter}
          onChange={(e) => setTextFilter(e.target.value)}
          style={{ flex: 1, marginRight: "10px" }} // Add margin to separate inputs
        />
        <Input
          type="text"
          placeholder="Filter by topic"
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          style={{ flex: 1, margin: "0 10px" }} // Add margin to separate inputs
        />
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{ flex: 1, marginLeft: "10px" }} // Add margin to separate inputs
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <FormattedMessage id="question" />
            </TableHead>
            <TableHead>
              <FormattedMessage id="topic" />
            </TableHead>
            <TableHead>
              <FormattedMessage id="dateOfCreation" />
            </TableHead>
            <TableHead>
              <FormattedMessage id="code" />
            </TableHead>
            <TableHead>
              <FormattedMessage id="actions" />
            </TableHead>
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
                <TableCell>
                  <Button
                    onClick={() =>
                      router.push(`/home/createQuestion/${question.code}`)
                    }
                  >
                    <FormattedMessage id="edit" />
                  </Button>
                </TableCell>
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
