"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Award, Camera, CheckCircle2, Circle, PlayCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { Aula, Curso, ProgressResult } from "@/lib/supabase/types"
import { formatarDuracao } from "@/utils/formatarDuracao"

type DetalhesCursoViewProps = {
  curso: Curso
  aulas: Aula[]
  concluidas: Set<string>
  progresso: ProgressResult
}

export function DetalhesCursoView({
  curso,
  aulas,
  concluidas,
  progresso,
}: DetalhesCursoViewProps) {
  const { concluidas: numConcluidas, total, percentual } = progresso
  const isComplete = percentual >= 100
  const primeiraAulaId = aulas[0]?.id

  return (
    <main className={cn("min-h-screen bg-background")}>
      {/* Header do curso */}
      <div className={cn("bg-teal-900 text-white")}>
        <div
          className={cn(
            "max-w-4xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-8 items-start",
          )}
        >
          {/* Thumbnail */}
          <div className={cn("shrink-0")}>
            {curso.thumbnail_url ? (
              <Image
                src={curso.thumbnail_url}
                alt={`Capa do curso ${curso.title}`}
                width={240}
                height={144}
                className={cn("w-60 rounded-lg object-cover")}
              />
            ) : (
              <div
                className={cn(
                  "w-60 h-36 rounded-lg bg-teal-800 flex items-center justify-center",
                )}
                aria-hidden="true"
              >
                <Camera className={cn("size-10 text-teal-600")} />
              </div>
            )}
          </div>

          {/* Info do curso */}
          <div className={cn("flex-1 space-y-4")}>
            <h1 className={cn("text-2xl font-bold leading-snug")}>{curso.title}</h1>

            {curso.description && (
              <p className={cn("text-teal-100 text-sm leading-relaxed")}>
                {curso.description}
              </p>
            )}

            {/* Progresso */}
            <div className={cn("space-y-1.5")}>
              <Progress
                value={percentual}
                className={cn("h-2 bg-teal-700 [&>div]:bg-amber-400")}
                aria-label={`Progresso: ${numConcluidas} de ${total} aulas concluídas`}
              />
              <p className={cn("text-sm text-teal-200")}>
                {numConcluidas} de {total} aula{total !== 1 ? "s" : ""} concluída
                {total !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Ações */}
            <div className={cn("flex flex-wrap gap-3 pt-2")}>
              {isComplete ? (
                <Button
                  className={cn(
                    "bg-amber-500 hover:bg-amber-400 text-teal-900 font-bold border-0 gap-2",
                  )}
                  nativeButton={false}
                  render={<Link href={`/api/certificados/${curso.id}`} />}
                >
                  <Award className={cn("size-4")} aria-hidden="true" />
                  Baixar Certificado
                </Button>
              ) : primeiraAulaId ? (
                <Button
                  className={cn(
                    "bg-white text-teal-900 hover:bg-teal-50 font-bold border-0 gap-2",
                  )}
                  nativeButton={false}
                  render={
                    <Link
                      href={`/minha-area/cursos/${curso.id}/aulas/${primeiraAulaId}`}
                    />
                  }
                >
                  <PlayCircle className={cn("size-4")} aria-hidden="true" />
                  {numConcluidas > 0 ? "Continuar" : "Começar"}
                </Button>
              ) : null}

              <Button
                variant="ghost"
                className={cn(
                  "text-teal-100 hover:text-white hover:bg-teal-800 gap-1",
                )}
                nativeButton={false}
                render={<Link href="/minha-area" />}
              >
                <ArrowLeft className={cn("size-4")} aria-hidden="true" />
                Minha Área
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de aulas */}
      <div className={cn("max-w-4xl mx-auto px-6 py-8")}>
        <h2 className={cn("text-lg font-semibold text-slate-900 mb-4")}>
          Aulas do curso
        </h2>

        {aulas.length === 0 ? (
          <div className={cn("flex flex-col items-center py-16 text-slate-400 gap-3")}>
            <PlayCircle className={cn("size-12 text-slate-200")} aria-hidden="true" />
            <p className={cn("text-sm")}>Nenhuma aula disponível ainda.</p>
          </div>
        ) : (
          <ol className={cn("space-y-2 list-none p-0 m-0")} role="list">
            {aulas.map((aula, index) => {
              const isConcluida = concluidas.has(aula.id)
              return (
                <li key={aula.id}>
                  <Link
                    href={`/minha-area/cursos/${curso.id}/aulas/${aula.id}`}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border bg-card transition-colors",
                      "hover:bg-accent hover:border-accent",
                      isConcluida && "bg-emerald-50/60 border-emerald-100",
                    )}
                  >
                    <span className={cn("shrink-0")}>
                      {isConcluida ? (
                        <CheckCircle2
                          className={cn("size-5 text-emerald-600")}
                          aria-label="Aula concluída"
                        />
                      ) : (
                        <Circle
                          className={cn("size-5 text-slate-300")}
                          aria-label="Aula não concluída"
                        />
                      )}
                    </span>

                    <span className={cn("flex-1 min-w-0")}>
                      <span
                        className={cn(
                          "block text-xs text-muted-foreground mb-0.5",
                        )}
                      >
                        Aula {index + 1}
                      </span>
                      <span
                        className={cn(
                          "block text-sm font-medium text-foreground leading-snug",
                        )}
                      >
                        {aula.title}
                      </span>
                    </span>

                    <div className={cn("flex items-center gap-3 shrink-0")}>
                      {aula.duration_seconds && (
                        <span className={cn("text-xs text-muted-foreground")}>
                          {formatarDuracao(aula.duration_seconds)}
                        </span>
                      )}
                      {isConcluida && (
                        <Badge
                          variant="default"
                          className={cn(
                            "bg-emerald-500/15 text-emerald-700 border-emerald-500/20 text-xs",
                          )}
                        >
                          Concluída
                        </Badge>
                      )}
                    </div>
                  </Link>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </main>
  )
}
