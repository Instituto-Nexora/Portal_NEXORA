import {
  Activity,
  CalendarDays,
  GraduationCap,
  MousePointerClick,
  ShieldCheck,
  TrendingUp,
  Tv2,
  Users,
} from "lucide-react";
import Link from "next/link";
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
  totalEventos: number;
  eventosPublicados: number;
  totalAdmins: number;
  totalAlunos: number;
  totalAcessos: number;
  acessosHoje: number;
  acessosSemana: number;
  alunosAtivos: number;
  topRecursos: TopRecurso[];
  acessosAutenticados: number;
};

type StatCard = {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  href: string;
};

const RESOURCE_TYPE_LABEL: Record<string, string> = {
  course: "Curso",
  event: "Evento",
  page: "Página",
};

export function DashboardView({
  totalEventos,
  eventosPublicados,
  totalAdmins,
  totalAlunos,
  totalAcessos,
  acessosHoje,
  acessosSemana,
  alunosAtivos,
  topRecursos,
  acessosAutenticados,
}: Props) {
  const entityCards: StatCard[] = [
    {
      title: "Total de eventos",
      value: totalEventos,
      description: `${eventosPublicados} publicado${eventosPublicados !== 1 ? "s" : ""}`,
      icon: CalendarDays,
      href: "/cms/dashboard/eventos",
    },
    {
      title: "Eventos publicados",
      value: eventosPublicados,
      description: `de ${totalEventos} cadastrado${totalEventos !== 1 ? "s" : ""}`,
      icon: Tv2,
      href: "/cms/dashboard/eventos?status=published",
    },
    {
      title: "Administradores",
      value: totalAdmins,
      description: "com acesso ao CMS",
      icon: ShieldCheck,
      href: "/cms/dashboard/admins",
    },
    {
      title: "Alunos",
      value: totalAlunos,
      description: `cadastrado${totalAlunos !== 1 ? "s" : ""}`,
      icon: GraduationCap,
      href: "/cms/dashboard/alunos",
    },
  ];

  const accessCards = [
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
        <h1 className={cn("text-xl font-bold tracking-tight sm:text-2xl")}>
          Dashboard
        </h1>
        <p className={cn("text-muted-foreground mt-1")}>
          Bem-vindo ao painel de administração do Portal NEXORA-TI.
        </p>
      </div>

      <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4")}>
        {entityCards.map(({ title, value, description, icon: Icon, href }) => (
          <Link key={title} href={href} className={cn("group")}>
            <Card className={cn("transition-shadow group-hover:shadow-md")}>
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
                <p className={cn("text-xs text-muted-foreground mt-1")}>
                  {description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4")}>
        {accessCards.map(({ title, value, description, icon: Icon }) => (
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
              <p className={cn("text-xs text-muted-foreground mt-1")}>
                {description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className={cn("grid gap-6 lg:grid-cols-2")}>
        <Card>
          <CardHeader>
            <CardTitle className={cn("flex items-center gap-2")}>
              <MousePointerClick
                className={cn("size-4 text-primary")}
                aria-hidden="true"
              />
              Recursos mais acessados
            </CardTitle>
            <CardDescription>Top 10 por contagem de acessos.</CardDescription>
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
                {topRecursos.map((r) => {
                  const maxCount = topRecursos[0]?.access_count ?? 1;
                  const pct = Math.round((r.access_count / maxCount) * 100);
                  return (
                    <div
                      key={`${r.resource_type}-${r.resource_slug}`}
                      className={cn("space-y-1")}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-between gap-2",
                        )}
                      >
                        <div
                          className={cn("flex min-w-0 items-center gap-2")}
                        >
                          <Badge variant="outline" className={cn("shrink-0")}>
                            {RESOURCE_TYPE_LABEL[r.resource_type] ??
                              r.resource_type}
                          </Badge>
                          <span className={cn("truncate text-sm font-medium")}>
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

        <AcessosPieCard
          totalAcessos={totalAcessos}
          acessosAutenticados={acessosAutenticados}
        />
      </div>
    </div>
  );
}

type PieCardProps = {
  totalAcessos: number;
  acessosAutenticados: number;
};

function AcessosPieCard({ totalAcessos, acessosAutenticados }: PieCardProps) {
  const anonimos = totalAcessos - acessosAutenticados;
  const pctAuth =
    totalAcessos > 0 ? Math.round((acessosAutenticados / totalAcessos) * 100) : 0;
  const pctAnon = 100 - pctAuth;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("flex items-center gap-2")}>
          <Users className={cn("size-4 text-primary")} aria-hidden="true" />
          Alunos vs. Anônimos
        </CardTitle>
        <CardDescription>
          Distribuição de acessos por tipo de visitante.
        </CardDescription>
      </CardHeader>
      <CardContent className={cn("flex flex-col items-center gap-6 pt-2")}>
        {totalAcessos === 0 ? (
          <p className={cn("py-8 text-center text-sm text-muted-foreground")}>
            Nenhum acesso registrado ainda.
          </p>
        ) : (
          <>
            <div
              className={cn("relative size-36 rounded-full")}
              style={{
                background: `conic-gradient(var(--primary) ${pctAuth}%, var(--muted-foreground) ${pctAuth}%)`,
              }}
              role="img"
              aria-label={`${pctAuth}% alunos, ${pctAnon}% anônimos`}
            >
              <div
                className={cn(
                  "absolute inset-[27%] rounded-full bg-card",
                )}
              />
            </div>

            <dl className={cn("w-full space-y-2")}>
              <div className={cn("flex items-center justify-between gap-2")}>
                <dt className={cn("flex items-center gap-2 text-sm")}>
                  <span
                    className={cn("inline-block size-3 rounded-full bg-primary")}
                  />
                  Alunos
                </dt>
                <dd className={cn("text-sm font-bold tabular-nums")}>
                  {acessosAutenticados}{" "}
                  <span className={cn("font-normal text-muted-foreground")}>
                    ({pctAuth}%)
                  </span>
                </dd>
              </div>
              <div className={cn("flex items-center justify-between gap-2")}>
                <dt className={cn("flex items-center gap-2 text-sm")}>
                  <span
                    className={cn(
                      "inline-block size-3 rounded-full bg-muted-foreground",
                    )}
                  />
                  Anônimos
                </dt>
                <dd className={cn("text-sm font-bold tabular-nums")}>
                  {anonimos}{" "}
                  <span className={cn("font-normal text-muted-foreground")}>
                    ({pctAnon}%)
                  </span>
                </dd>
              </div>
            </dl>
          </>
        )}
      </CardContent>
    </Card>
  );
}
