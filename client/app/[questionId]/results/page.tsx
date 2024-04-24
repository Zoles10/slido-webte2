import Logo from "@/components/logo";
import LogoutButton from "@/components/ui/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";
import { Paragraph, TypographyH2 } from "@/components/ui/typography/typography";
import WordCloud from "@/components/ui/word-cloud";
import { redirect } from "next/navigation";
import { DataTable } from "./data-table";
import { columns, Result } from "./columns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ToggleButton from "./toggle-button";

async function getData(): Promise<Result[]> {
  // Fetch data from your API here.
  return [
    {
      amount: 100,
      name: "Bratislava",
    },
    {
      amount: 20,
      name: "Poprad",
    },
    // ...
  ];
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { questionId: string };
  searchParams: {
    cloud: boolean;
  };
}) {
  const data = await getData();
  const showCloud = searchParams.cloud;
  console.log(showCloud);

  return (
    <div>
      <header className="flex justify-between items-center w-full p-2">
        <Logo />
        <div className="flex space-x-4">
          <LogoutButton />
          <ModeToggle />
        </div>
      </header>
      <main className="flex  flex-col p-2 items-center">
        <TypographyH2>Question {params.questionId}</TypographyH2>
        <Paragraph>This is a question results page</Paragraph>
        <ToggleButton showCloud={showCloud} />
        {/* <Button onClick={() => setShowCloud(!showCloud)}>Toggle cloud</Button> */}
        {showCloud ? null : ( //   <WordCloud results={RESULTS} />
          <DataTable data={data} columns={columns} />
        )}
      </main>
    </div>
  );
}
