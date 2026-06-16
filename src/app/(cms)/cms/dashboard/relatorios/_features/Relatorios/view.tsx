import {
  Activity,
  CalendarDays,
  GraduationCap,
  MousePointerClick,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TopRecurso = {
  resource_type: string;
  resource_slug: string | null;
  access_count: number;
  unique_students: number;
};

type Props = {
  totalAcessos: number;
  acessosHoje: number;
  acessosSemana: number;
  alunosAtivos: number;
  topRecursos: TopRecurso[];
  eventosPorStatus: Record<string, number>;
  totalMatriculas: number;
};

const RESOURCE_TYPE_LABEL: Record<string, string> = {
  course: "Curso",
  event: "Evento",
  page: "Página",
};

const EVENT_STATUS_LABEL: Record<string, string> = {
  draft: "Rascunho",
  published: "Publicado",
  archived: "Arquivado",
};

const EVENT_STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "outline"
> = {
  draft: "outline",
  published: "default",
  archived: "secondary",
};

export function RelatoriosView({
  totalAcessos,
  acessosHoje,
  acessosSemana,
  alunosAtivos,
  topRecursos,
  eventosPorStatus,
  totalMatriculas,
}: Props) {
  const summaryCards = [
    {
      title: "Total de acessos",
      value: totalAcessos,
      description: "desde o início",
      icon: MousePointerClick,
    },
    {
      title: "Acessos hoje",
      value: acessosHoje,
      description: "no dia atual",
      icon: Activity,
    },
    {
      title: "Acessos (7 dias)",
      value: acessosSemana,
      description: "últimos 7 dias",
      icon: TrendingUp,
    },
    {
      title: "Alunos ativos",
      value: alunosAtivos,
      description: "últimos 30 dias",
      icon: Users,
    },
  ];

  return (
    <div className={cn("space-y-6")}>
      <div>
        <h2 className={cn("text-xl font-bold tracking-tight sm:text-2xl")}>
          Relatórios
        </h2>
        <p className={cn("mt-1 text-sm text-muted-foreground")}>
          Métricas de acesso, engajamento e conteúdo do portal.
        </p>
      </div>

      {/* Summary cards */}
      <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4")}>
        {summaryCards.map(({ title, value, description, icon: Icon }) => (
          <Card key={title}>
            <CardHeader
              className={cn(
                "flex flex-row items-center justify-between pb-2",
              )}
            >
              <CardTitle
                className={cn("text-sm font-medium text-muted-foreground")}
              >
                {title}
              </CardTitle>
              <Icon
                className={cn("size-4 text-muted-foreground")}
                aria-hidden="true"
              />
            </CardHeader>
            <CardContent>
              <p className={cn("text-2xl font-bold sm:text-3xl")}>{value}</p>
              <p className={cn("mt-1 text-xs text-muted-foreground")}>
                {description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className={cn("grid gap-6 lg:grid-cols-2")}>
        {/* Top recursos acessados */}
        <Card>
          <CardHeader>
            <CardTitle className={cn("flex items-center gap-2")}>
              <MousePointerClick
                className={cn("size-4 text-primary")}
                aria-hidden="true"
              />
              Recursos mais acessados
            </CardTitle>
            <CardDescription>
              Top 10 por contagem de acessos únicos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topRecursos.length === 0 ? (
              <p
                className={cn(
                  "py-8 text-center text-sm text-muted-foreground",
                )}
              >
                Nenhum acesso registrado ainda.
              </p>
            ) : (
              <div className={cn("space-y-3")}>
                {topRecursos.map((r, index) => {
                  const maxCount = topRecursos[0]?.access_count ?? 1;
                  const pct = Math.round((r.access_count / maxCount) * 100);
                  return (
                    <div key={index} className={cn("space-y-1")}>
                      <div
                        className={cn("flex items-center justify-between gap-2")}
                      >
                        <div
                          className={cn(
                            "flex min-w-0 items-center gap-2",
                          )}
                        >
                          <Badge variant="outline" className={cn("shrink-0")}>
                            {RESOURCE_TYPE_LABEL[r.resource_type] ??
                              r.resource_type}
                          </Badge>
                          <span
                            className={cn(
                              "truncate text-sm font-medium",
                            )}
                          >
                            {r.resource_slug ?? "—"}
                          </span>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 text-sm font-bold tabular-nums",
                          )}
                        >
                          {r.access_count}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "h-1.5 w-full overflow-hidden rounded-full bg-muted",
                        )}
                      >
                        <div
                          className={cn("h-full rounded-full bg-primary")}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className={cn("text-xs text-muted-foreground")}>
                        {r.unique_students} aluno
                        {r.unique_students !== 1 ? "s" : ""} únicos
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className={cn("space-y-6")}>
          {/* Eventos por status */}
          <Card>
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2")}>
                <CalendarDays
                  className={cn("size-4 text-primary")}
                  aria-hidden="true"
                />
                Eventos por status
              </CardTitle>
              <CardDescription>Distribuição atual do catálogo.</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(eventosPorStatus).length === 0 ? (
                <p
                  className={cn(
                    "py-6 text-center text-sm text-muted-foreground",
                  )}
                >
                  Nenhum evento cadastrado.
                </p>
              ) : (
                <div className={cn("space-y-2")}>
                  {Object.entries(eventosPorStatus).map(([status, count]) => (
                    <div
                      key={status}
                      className={cn(
                        "flex items-center justify-between",
                      )}
                    >
                      <Badge
                        variant={
                          EVENT_STATUS_VARIANT[status] ?? "outline"
                        }
                      >
                        {EVENT_STATUS_LABEL[status] ?? status}
                      </Badge>
                      <span className={cn("text-sm font-bold tabular-nums")}>
                        {count} evento{count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Matrículas */}
          <Card>
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2")}>
                <GraduationCap
                  className={cn("size-4 text-primary")}
                  aria-hidden="true"
                />
                Matrículas
              </CardTitle>
              <CardDescription>Total de alunos matriculados.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className={cn("text-3xl font-bold")}>{totalMatriculas}</p>
              <p className={cn("mt-1 text-xs text-muted-foreground")}>
                matrícula{totalMatriculas !== 1 ? "s" : ""} ativa
                {totalMatriculas !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
