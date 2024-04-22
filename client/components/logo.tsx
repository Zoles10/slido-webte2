import { Dancing_Script } from "next/font/google";
import Link from "next/link";
const dancingScript = Dancing_Script({ subsets: ["latin"] });

export default function Logo() {
  return (
    <Link href={"/"}>
      <h1 className={dancingScript.className + " text-6xl font-bold"}>
        Slid.in
      </h1>
    </Link>
  );
}
