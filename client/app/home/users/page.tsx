"use client";
import React from "react";
import Logo from "@/components/logo";
import LogoutButton from "@/components/ui/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";
import UsersTable from "@/components/ui/usersTable";
import { FormattedMessage } from "react-intl";
import LanguageSwitcher from "@/components/ui/languageSwitcher";

export type User = {
  user_id: number;
  name: string;
  lastname: string;
  email: string;
  created_at: string;
};
export default async function Users({
  searchParams,
}: {
  searchParams: {
    all: string;
  };
}) {
  return (
    <>
      <header className="flex justify-between items-center w-full p-2">
        <Logo />
        <div className="flex space-x-4">
          <LanguageSwitcher />
          <ModeToggle />
          <LogoutButton />
        </div>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-center p-24 ">
        <div className="w-full max-w-2xl p-8 shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center">
            <FormattedMessage id="users" />
          </h1>

          <UsersTable all={searchParams.all == "true"} />
          <div className="actions-container mt-4 text-center">
            <div
              className="text-orange-500 hover:underline cursor-pointer mx-2"
              onClick={() => {
                window.location.href = "/home";
              }}
            >
              <FormattedMessage id="home" />
            </div>
            <div
              className="text-orange-500 hover:underline cursor-pointer mx-2"
              onClick={() => {
                window.location.href = "/home/createUser";
              }}
            >
              <FormattedMessage id="addUser" />
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
