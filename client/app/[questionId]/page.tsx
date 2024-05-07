import Logo from "@/components/logo";
import LogoutButton from "@/components/ui/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Paragraph, TypographyH2 } from "@/components/ui/typography/typography";
import Link from "next/link";
import { Input } from "@/components/ui/input";


async function getDataQuestion(questionId: any) {
  const response = await fetch(`https://node98.webte.fei.stuba.sk/slido-webte2/server/api/question/${questionId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
}

async function getAnswer(questionId: any) {
  const response = await fetch(`https://node98.webte.fei.stuba.sk/slido-webte2/server/api/answer/${questionId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
}





export default async function Page({ params }: { params: { questionId: string } }) {
  const  apiData = await getDataQuestion(params.questionId);
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
        <TypographyH2>Question {apiData.question_string}</TypographyH2>
        { apiData.question_type === 'open' ? (
          <Input type="text" placeholder="Answer" />
        ) : (
          <Paragraph>Multiple choice question</Paragraph>
        )}
        <Link href={`/${params.questionId}/results`}>
          <Button>Go to results</Button>
        </Link>
      </main>
    </div>
  );
}
