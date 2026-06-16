import type { Metadata } from "next";
import LoginView from "./_features/login/view";

export const metadata: Metadata = {
  title: "Entrar - NEXORA-TI",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <LoginView />
    </main>
  );
}
