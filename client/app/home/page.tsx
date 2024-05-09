"use client";
import { useAuth } from "@/components/auth/auth_provider";
import Logo from "@/components/logo";
import LogoutButton from "@/components/ui/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import NavigateButton from "@/components/ui/navigateButton";
import { Label } from "@/components/ui/label";
import Search from "@/components/search";
import NavigateMyQuestions from "@/components/ui/navigateMyQuestions";
import LanguageSwitcher from "@/components/ui/languageSwitcher";
import { FormattedMessage } from "react-intl";
import NavigateToUsers from "@/components/ui/navigateToUsers";

export default function Home() {
  const { user, isAdmin } = useAuth();
  return (
    <>
      <header className="flex justify-between items-center w-full p-2">
        <Logo />
        <div className="flex space-x-4">
          <LanguageSwitcher />
          <ModeToggle />
          <NavigateButton />
          <NavigateMyQuestions />
          {isAdmin && <NavigateToUsers />}
          <LogoutButton />
        </div>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-center  space-y-10">
        <div className="flex flex-row">
          <h1 className="text-2xl font-bold">
            <FormattedMessage id="welcome" defaultMessage="Vitajte" />
            &nbsp;
          </h1>
          <h1 className="text-2xl font-bold text-orange-500">
            {` ${user?.name}  ${user?.lastname}` ?? "John doe"}
          </h1>
        </div>
        <p className="text-lg">
          <FormattedMessage
            id="youAreOnTheHomepage"
            defaultMessage="Ste na domovskej obrazovke"
          />
        </p>
        <div className="w-11/12 sm:w-2/3 text-center space-y-2 ">
          <Label>
            <FormattedMessage
              id="dontHaveQRCode"
              defaultMessage="Nemáte QR kód? Vyhľadajte otázku podľa kódu"
            />
          </Label>
          <Search />
        </div>
      </main>
    </>
  );
}
