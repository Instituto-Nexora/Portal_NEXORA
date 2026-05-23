"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorPageProps = {
  error: Error;
  reset: () => void;
};

export default function MinhaAreaError({ error, reset }: ErrorPageProps) {
  return (
    <div className={cn("container mx-auto py-8")}>
      <div className={cn("rounded-lg border bg-white p-12 text-center")}>
        <h1 className={cn("text-2xl font-bold text-slate-900")}>
          Erro ao carregar seus cursos
        </h1>
        <p className={cn("mt-2 text-slate-500")}>
          Não foi possível carregar a lista de cursos. Tente novamente.
        </p>
        <p className={cn("mt-1 text-sm text-slate-400")}>{error.message}</p>
        <div className={cn("mt-6 flex justify-center gap-4")}>
          <Button onClick={reset}>Tentar novamente</Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/" />}
          >
            Voltar ao início
          </Button>
        </div>
      </div>
    </div>
  );
}
