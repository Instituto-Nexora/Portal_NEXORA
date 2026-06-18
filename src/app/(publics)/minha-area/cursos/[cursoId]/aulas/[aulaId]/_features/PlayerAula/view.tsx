"use client"

import Link from "next/link"
import { Award, CheckCircle2, Circle, PlayCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Aula, Curso } from "@/lib/supabase/types"
import { usePlayerAulaViewModel } from "./viewModel"

type Props = {
  aula: Aula
  curso: Curso
  aulas: Aula[]
  aulasConcluidas: string[]
  userId: string
}

function formatarDuracao(segundos: number | null): string {
  if (!segundos) return ""
  const h = Math.floor(segundos / 3600)
  const m = Math.floor((segundos % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function PlayerAulaView({ aula, curso, aulas, aulasConcluidas, userId }: Props) {
  const { concluidas, isConcluida, isPending, handleMarcarConcluida } =
    usePlayerAulaViewModel(curso.id, aula.id, userId, aulasConcluidas)

  const aulasCursoConcluidas = aulas.filter((a) => concluidas.has(a.id)).length
  const isCursoCompleto = aulas.length > 0 && aulasCursoConcluidas === aulas.length

  return (
    <div className={cn("flex flex-col lg:flex-row min-h-screen bg-background")}>
      {/* Player principal */}
      <main className={cn("flex-1 flex flex-col")}>
        {/* Vídeo */}
        <div className={cn("relative w-full bg-black aspect-video")}>
          {aula.video_url ? (
            <iframe
              src={aula.video_url}
              title={aula.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={cn("absolute inset-0 w-full h-full")}
            />
          ) : (
            <div className={cn("absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/50")}>
              <PlayCircle className={cn("w-16 h-16")} aria-hidden="true" />
              <p className={cn("text-sm")}>Vídeo não disponível para esta aula.</p>
            </div>
          )}
        </div>

        {/* Info da aula */}
        <div className={cn("p-6 max-w-3xl space-y-4")}>
          <div className={cn("flex items-start justify-between gap-4")}>
            <div className={cn("space-y-1")}>
              <p className={cn("text-xs text-muted-foreground font-medium uppercase tracking-wide")}>
                {curso.title}
              </p>
              <h1 className={cn("text-xl font-bold text-foreground")}>
                {aula.title}
              </h1>
              {aula.duration_seconds && (
                <p className={cn("text-sm text-muted-foreground")}>
                  {formatarDuracao(aula.duration_seconds)}
                </p>
              )}
            </div>

            <div className={cn("flex items-center gap-2 shrink-0")}>
              {isConcluida ? (
                <Badge
                  variant="default"
                  className={cn("gap-1.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20")}
                >
                  <CheckCircle2 className={cn("w-3.5 h-3.5")} aria-hidden="true" />
                  Concluída
                </Badge>
              ) : (
                <Button
                  onClick={handleMarcarConcluida}
                  disabled={isPending}
                  size="sm"
                  className={cn("gap-2")}
                >
                  <CheckCircle2 className={cn("w-4 h-4")} aria-hidden="true" />
                  {isPending ? "Salvando..." : "Marcar como concluída"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Sidebar — lista de aulas */}
      <aside
        className={cn(
          "w-full lg:w-80 lg:min-h-screen border-t lg:border-t-0 lg:border-l bg-card",
        )}
        aria-label="Lista de aulas do curso"
      >
        <div className={cn("p-4 border-b")}>
          <h2 className={cn("text-sm font-semibold text-foreground")}>
            Aulas do curso
          </h2>
          <p className={cn("text-xs text-muted-foreground mt-0.5")}>
            {aulasCursoConcluidas} de {aulas.length} concluída{aulas.length !== 1 ? "s" : ""}
          </p>

          {isCursoCompleto && (
            <Button
              size="sm"
              className={cn(
                "w-full mt-3 gap-2 bg-amber-500 hover:bg-amber-400 text-teal-900 font-bold border-0",
              )}
              nativeButton={false}
              render={<Link href={`/api/certificados/${curso.id}`} />}
            >
              <Award className={cn("w-4 h-4")} aria-hidden="true" />
              Baixar Certificado
            </Button>
          )}
        </div>

        <nav>
          <ul className={cn("divide-y")} role="list">
            {aulas.map((a, index) => {
              const isAtiva = a.id === aula.id
              const isConcluídaItem = concluidas.has(a.id)

              return (
                <li key={a.id}>
                  <Link
                    href={`/minha-area/cursos/${curso.id}/aulas/${a.id}`}
                    aria-current={isAtiva ? "page" : undefined}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      isAtiva && "bg-accent/60 font-medium",
                    )}
                  >
                    <span className={cn("mt-0.5 shrink-0")}>
                      {isConcluídaItem ? (
                        <CheckCircle2
                          className={cn("w-4 h-4 text-emerald-600 dark:text-emerald-400")}
                          aria-label="Concluída"
                        />
                      ) : (
                        <Circle
                          className={cn("w-4 h-4 text-muted-foreground")}
                          aria-label="Não concluída"
                        />
                      )}
                    </span>
                    <span className={cn("flex-1 min-w-0")}>
                      <span className={cn("block text-xs text-muted-foreground mb-0.5")}>
                        Aula {index + 1}
                      </span>
                      <span className={cn("block text-sm leading-snug line-clamp-2")}>
                        {a.title}
                      </span>
                      {a.duration_seconds && (
                        <span className={cn("block text-xs text-muted-foreground mt-0.5")}>
                          {formatarDuracao(a.duration_seconds)}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </div>
  )
}
