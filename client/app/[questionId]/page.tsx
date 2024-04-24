import Logo from "@/components/logo";
import LogoutButton from "@/components/ui/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Paragraph, TypographyH2 } from "@/components/ui/typography/typography";
import Link from "next/link";

export default function Page({ params }: { params: { questionId: string } }) {
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
        <Paragraph>This is a question page</Paragraph>
        <Link href={`/${params.questionId}/results`}>
          <Button>Go to results</Button>
        </Link>
      </main>
    </div>
  );
}
