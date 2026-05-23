"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Lesson } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { extractVideoId } from "@/utils/video";
import { type AulaComProgresso, usePlayerAulaViewModel } from "./viewModel";

type PlayerAulaViewProps = {
  aula: Lesson;
  aulas: AulaComProgresso[];
  cursoId: string;
};

export default function PlayerAulaView({
  aula,
  aulas,
  cursoId,
}: PlayerAulaViewProps) {
  const {
    aulaAtiva,
    aulas: aulasComProgresso,
    isPending,
    toggleConcluida,
    handleNavegar,
  } = usePlayerAulaViewModel(aula, aulas);

  const video = extractVideoId(aulaAtiva.video_url ?? "");
  const temVideo = !!aulaAtiva.video_url;
  const temMaterial = !!aulaAtiva.material_url;
  const aulaConcluida = aulasComProgresso.find(
    (a) => a.id === aulaAtiva.id,
  )?.concluida;

  return (
    <div className={cn("min-h-screen bg-slate-950")}>
      <div className={cn("border-b border-slate-800 bg-slate-900 p-4")}>
        <Link
          href={`/minha-area/cursos/${cursoId}`}
          className={cn(
            "inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200",
          )}
        >
          &larr; Voltar para o curso
        </Link>
      </div>

      <div
        className={cn(
          "mx-auto grid max-w-7xl grid-cols-1 items-start gap-0 lg:grid-cols-[1fr_380px]",
        )}
      >
        <div className={cn("flex flex-col")}>
          {temVideo && (
            <div className={cn("relative aspect-video w-full bg-black")}>
              {video ? (
                <iframe
                  src={
                    video.platform === "youtube"
                      ? `https://www.youtube.com/embed/${video.id}`
                      : `https://player.vimeo.com/video/${video.id}`
                  }
                  className={cn("h-full w-full")}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={aulaAtiva.title}
                />
              ) : (
                <div
                  className={cn(
                    "flex h-full items-center justify-center text-slate-400",
                  )}
                >
                  <p>Vídeo indisponível</p>
                </div>
              )}
            </div>
          )}

          <div className={cn("flex flex-col gap-6 p-6")}>
            <h1 className={cn("text-xl font-bold text-white")}>
              {aulaAtiva.title}
            </h1>

            {temMaterial && (
              <div
                className={cn(
                  "rounded-lg border border-slate-700 bg-slate-900 p-5",
                )}
              >
                <h2
                  className={cn(
                    "mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400",
                  )}
                >
                  Material de Apoio
                </h2>
                <a
                  href={aulaAtiva.material_url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-3 text-sm text-teal-300 transition-colors hover:bg-slate-700 hover:text-teal-200",
                  )}
                >
                  <svg
                    className={cn("size-5 shrink-0")}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Abrir material
                </a>
              </div>
            )}

            <div
              className={cn(
                "flex flex-wrap items-center gap-3 border-t border-slate-800 pt-4",
              )}
            >
              <Button
                onClick={toggleConcluida}
                disabled={isPending}
                className={cn(
                  aulaConcluida
                    ? "border-slate-600 text-slate-200 hover:bg-slate-800"
                    : "bg-teal-600 text-white hover:bg-teal-700",
                )}
                variant={aulaConcluida ? "outline" : "default"}
              >
                {isPending
                  ? "Salvando..."
                  : aulaConcluida
                    ? "Desmarcar conclusão"
                    : "Marcar como concluída"}
              </Button>

              {aulaConcluida && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-sm text-teal-400",
                  )}
                >
                  <span aria-hidden="true">✓</span>
                  Aula concluída
                </span>
              )}
            </div>
          </div>
        </div>

        <aside
          className={cn("border-l border-slate-800 bg-slate-900")}
          aria-label="Aulas do curso"
        >
          <div className={cn("p-4")}>
            <h2
              className={cn(
                "mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400",
              )}
            >
              Aulas do curso
            </h2>

            <nav className={cn("flex flex-col gap-1")}>
              {aulasComProgresso.length === 0 ? (
                <p className={cn("text-sm text-slate-500")}>
                  Nenhuma aula disponível.
                </p>
              ) : (
                aulasComProgresso.map((aulaItem) => {
                  const isActive = aulaItem.id === aulaAtiva.id;
                  return (
                    <button
                      key={aulaItem.id}
                      type="button"
                      onClick={() => handleNavegar(aulaItem.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                        isActive
                          ? "bg-teal-600/20 text-teal-300"
                          : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                          aulaItem.concluida
                            ? "bg-teal-600 text-white"
                            : "border border-slate-600 text-slate-500",
                        )}
                        aria-hidden="true"
                      >
                        {aulaItem.concluida ? "✓" : aulaItem.position}
                      </span>
                      <span className={cn("line-clamp-2")}>
                        {aulaItem.title}
                      </span>
                    </button>
                  );
                })
              )}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}
