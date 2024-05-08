"use client";
import React from "react";
import AdminAddUserForm from "@/components/user/UserForm";
import Link from "next/link";
import { Paragraph } from "@/components/ui/typography/typography";
import Logo from "@/components/logo";
import LogoutButton from "@/components/ui/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";
import { FormattedMessage } from "react-intl";
import LanguageSwitcher from "@/components/ui/languageSwitcher";

export default function AddUserAdmin() {
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
            <FormattedMessage id="addNewUser" />
          </h1>
          <Paragraph>
            <FormattedMessage id="fillOutFormAndAddUser" />
          </Paragraph>
          <AdminAddUserForm />
          <div
            className="mt-4 text-center text-orange-500 hover:underline  cursor-pointer"
            onClick={() => {
              window.location.href = "/home";
            }}
          >
            <FormattedMessage id="home" />
          </div>
        </div>
      </main>
    </>
  );
}
