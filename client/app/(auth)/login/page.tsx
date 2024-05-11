import LoginForm from "../../../components/auth/login_form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24">
      <LoginForm />
    </main>
  );
}
