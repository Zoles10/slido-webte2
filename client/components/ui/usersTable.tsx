import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "../auth/auth_provider";
import { apiUrl } from "@/utils/config";
import { FormattedMessage } from "react-intl";
import { Input } from "@/components/ui/input";
import { Button } from "./button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";

interface User {
  user_id: number;
  name: string;
  lastname: string;
  email: string;
  created_at: string;
}

interface UsersTableProps {
  all: boolean;
  itemsPerPage?: number;
}

async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch(apiUrl + "users");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

const UsersTable: React.FC<UsersTableProps> = ({ all, itemsPerPage = 10 }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [nameFilter, setNameFilter] = useState("");
  const [lastNameFilter, setLastNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      let fetchedUsers = await fetchUsers();
      fetchedUsers = fetchedUsers.filter((user) => {
        const nameMatch = user.name
          .toLowerCase()
          .includes(nameFilter.toLowerCase());
        const lastNameMatch = user.lastname
          .toLowerCase()
          .includes(lastNameFilter.toLowerCase());
        const emailMatch = user.email
          .toLowerCase()
          .includes(emailFilter.toLowerCase());
        const dateMatch = dateFilter
          ? new Date(user.created_at).toLocaleDateString() ===
            new Date(dateFilter).toLocaleDateString()
          : true;

        return nameMatch && lastNameMatch && emailMatch && dateMatch;
      });

      setUsers(fetchedUsers);
      setTotalPages(Math.ceil(fetchedUsers.length / itemsPerPage));
    };

    loadUsers();
  }, [nameFilter, lastNameFilter, emailFilter, dateFilter, itemsPerPage, all]);

  const indexLastUser = currentPage * itemsPerPage;
  const indexFirstUser = indexLastUser - itemsPerPage;
  const currentUsers = users.slice(indexFirstUser, indexLastUser);

  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <PaginationItem key={number}>
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
          // disabled={currentPage <= 1}
        >
          Previous
        </PaginationPrevious>
        <PaginationContent>{items}</PaginationContent>
        <PaginationNext
          onClick={() => setCurrentPage(currentPage + 1)}
          // disabled={currentPage >= totalPages}
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
          placeholder="Filter by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          style={{ flex: 1, marginRight: "10px" }}
        />
        <Input
          type="text"
          placeholder="Filter by lastname"
          value={lastNameFilter}
          onChange={(e) => setLastNameFilter(e.target.value)}
          style={{ flex: 1, margin: "0 10px" }}
        />
        <Input
          type="text"
          placeholder="Filter by email"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          style={{ flex: 1, marginLeft: "10px" }}
        />
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{ flex: 1, marginLeft: "10px" }}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>
              <FormattedMessage id="name" />
            </TableHead>
            <TableHead>
              <FormattedMessage id="lastName" />
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>
              <FormattedMessage id="dateOfCreation" />
            </TableHead>
            <TableHead>
              <FormattedMessage id="actions" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell>{user.user_id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.lastname}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() =>
                      router.push(`/home/createUser/${user.user_id}`)
                    }
                  >
                    <FormattedMessage id="edit" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>No users found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {renderPagination()}
    </div>
  );
};

export default UsersTable;
