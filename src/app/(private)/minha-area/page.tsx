import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Meus Cursos - NEXORA",
};

export default async function MinhaAreaPage() {
  // Mock data: Aqui você fará o fetch dos cursos do aluno no Supabase
  const meusCursos = [
    {
      id: "trilha-frontend",
      title: "Trilha Frontend Iniciante",
      progress: 35,
      lastClass: "HTML Semântico",
    },
    {
      id: "trilha-logica",
      title: "Lógica de Programação",
      progress: 100,
      lastClass: "Certificado Liberado",
    },
  ];

  return (
    <div className={cn("container mx-auto py-8")}>
      <div className={cn("mb-8")}>
        <h1 className={cn("text-3xl font-bold text-slate-900")}>Meus Cursos</h1>
        <p className={cn("text-slate-500")}>
          Continue de onde parou ou inicie uma nova trilha.
        </p>
      </div>

      <div
        className={cn("grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6")}
      >
        {meusCursos.map((curso) => (
          <div
            key={curso.id}
            className={cn(
              "bg-white p-6 rounded-lg shadow-sm border flex flex-col gap-4",
            )}
          >
            <div>
              <h2 className={cn("text-xl font-semibold text-slate-900")}>
                {curso.title}
              </h2>
              <p className={cn("text-sm text-slate-500 mt-1")}>
                Última aula: {curso.lastClass}
              </p>
            </div>

            <div className={cn("flex flex-col gap-1 mt-auto")}>
              <div className={cn("flex justify-between text-sm")}>
                <span className={cn("font-medium text-slate-700")}>
                  Progresso
                </span>
                <span className={cn("text-slate-500")}>{curso.progress}%</span>
              </div>
              <div
                className={cn(
                  "w-full bg-slate-100 rounded-full h-2 overflow-hidden",
                )}
              >
                <div
                  className={cn(
                    "h-full rounded-full",
                    curso.progress === 100 ? "bg-green-500" : "bg-blue-600",
                  )}
                  style={{ width: `${curso.progress}%` }}
                />
              </div>
            </div>

            <div className={cn("pt-4 mt-2 border-t")}>
              <Button
                className={cn("w-full")}
                variant={curso.progress === 100 ? "outline" : "default"}
              >
                <Link href={`/minha-area/cursos/${curso.id}`}>
                  {curso.progress === 100 ? "Acessar Curso" : "Continuar Aula"}
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
