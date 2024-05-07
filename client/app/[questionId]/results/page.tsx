import Logo from "@/components/logo";
import LogoutButton from "@/components/ui/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";
import { Paragraph, TypographyH2 } from "@/components/ui/typography/typography";
import { Result } from "./columns";
import ToggleButton from "./toggle-button";
import WorldCloud from "@/components/ui/word-cloud";
import WordCloud from "@/components/ui/word-cloud";
import ResultsView from "./results-view";
import { Loader2 } from "lucide-react";
async function getDataQuestion(questionId: any) {
  // Assuming your API endpoint returns data based on questionId
  const response = await fetch(`https://node98.webte.fei.stuba.sk/slido-webte2/server/api/question/${questionId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
}
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
    {
      amount: 10,
      name: "Kosice",
    },
    {
      amount: 50,
      name: "Zilina",
    },
    {
      amount: 70,
      name: "Nitra",
    },
  ];
}

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: { questionId: string };
  searchParams: {
    cloud: boolean;
  };
}) {
  console.log("here");
  let apiData = null;
  let data = null;
  try {
    data = await getData();
    apiData = await getDataQuestion(params.questionId);
    console.log('API Data:', apiData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  const showCloud = searchParams.cloud;
  console.log('Show Cloud:', showCloud);

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
        <TypographyH2>Question {apiData.question_string} </TypographyH2>
        <Paragraph>This is a question results page</Paragraph>

        {data ? (
          <ResultsView data={data} />
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </main>
    </div>
  );
}



