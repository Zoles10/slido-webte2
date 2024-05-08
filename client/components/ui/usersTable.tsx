"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "../auth/auth_provider";
import { apiUrl } from "@/utils/config";
import { FormattedMessage } from "react-intl";

interface User {
  user_id: number;
  name: string;
  lastname: string;
  email: string;
  created_at: string;
}

interface UsersTableProps {
  all: boolean;
}

async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch(apiUrl + "users");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

const UsersTable: React.FC<UsersTableProps> = ({ all }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
      console.log("Users ", fetchedUsers);
    };

    loadUsers();
  }, [all]);

  console.log(users);

  useEffect(() => {
    console.log("Filtered users", users);
  }, [users]);

  return (
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
            {" "}
            <FormattedMessage id="dateOfCreation" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length > 0 ? (
          users.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell>{user.user_id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.lastname}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleString()}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5}>ˇŽiadny používatelia</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
