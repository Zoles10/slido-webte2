import React from 'react';
import AdminAddUserForm from "@/components/user/UserForm";
import Link from "next/link";
import { Paragraph } from "@/components/ui/typography/typography";
import Logo from "@/components/logo";
import LogoutButton from "@/components/ui/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";


export default function AddUserAdmin() {
    return (
      <>
        <header className="flex justify-between items-center w-full p-2">
          <Logo />
          <div className="flex space-x-4">
            <LogoutButton />
            <ModeToggle />
          </div>
        </header>
        <main className="flex min-h-screen flex-col items-center justify-center p-24 ">
          <div className="w-full max-w-2xl p-8 shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-center">
              Pridaj nového používateľa
            </h1>
            <Paragraph>Vyplň údaje o novom používateľovi</Paragraph>
            <AdminAddUserForm />
            <div className="mt-4 text-center">
              <Link href="/home" legacyBehavior>
                <a className="text-orange-500 hover:underline">Return to home</a>
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }