import { CalendarDays, ShieldCheck, Tv2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  totalEventos: number;
  eventosPublicados: number;
  totalAdmins: number;
};

type StatCard = {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  href: string;
};

export function DashboardView({ totalEventos, eventosPublicados, totalAdmins }: Props) {
  const cards: StatCard[] = [
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
  ];

  return (
    <div className={cn("space-y-6")}>
      <div>
        <h1 className={cn("text-2xl font-bold tracking-tight")}>Dashboard</h1>
        <p className={cn("text-muted-foreground mt-1")}>
          Bem-vindo ao painel de administração do Portal Nexora.
        </p>
      </div>

      <div className={cn("grid gap-4 md:grid-cols-3")}>
        {cards.map(({ title, value, description, icon: Icon, href }) => (
          <Link key={title} href={href} className={cn("group")}>
            <Card className={cn("transition-shadow group-hover:shadow-md")}>
              <CardHeader className={cn("flex flex-row items-center justify-between pb-2")}>
                <CardTitle className={cn("text-sm font-medium text-muted-foreground")}>
                  {title}
                </CardTitle>
                <Icon className={cn("size-4 text-muted-foreground")} aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <p className={cn("text-3xl font-bold")}>{value}</p>
                <p className={cn("text-xs text-muted-foreground mt-1")}>{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
