import Logo from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import LanguageSwitcher from "@/components/ui/languageSwitcher";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="absolute top-2 left-4">
        <Logo />
      </div>
      <div className="absolute top-2 right-2">
        <ModeToggle />
        <LanguageSwitcher />
      </div>
      {children}
    </div>
  );
}
