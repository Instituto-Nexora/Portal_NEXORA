import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminProfile, AdminRole } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type Props = {
  admins: AdminProfile[];
};

const ROLE_LABEL: Record<AdminRole, string> = {
  admin: "Admin",
  content_creator: "Content Creator",
  professor: "Professor",
  aluno: "Aluno",
};

const ROLE_VARIANT: Record<AdminRole, "default" | "secondary" | "outline"> = {
  admin: "default",
  content_creator: "secondary",
  professor: "outline",
  aluno: "default",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function AdminsListView({ admins }: Props) {
  return (
    <div className={cn("space-y-6")}>
      <div
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        )}
      >
        <div>
          <h2 className={cn("text-xl font-bold tracking-tight sm:text-2xl")}>
            Administradores
          </h2>
          <p className={cn("text-sm text-muted-foreground")}>
            Gerencie os usuários com acesso ao CMS.
          </p>
        </div>
        <Button
          nativeButton={false}
          className={cn("w-full sm:w-auto")}
          render={<Link href="/cms/dashboard/admins/novo" />}
        >
          Criar administrador
        </Button>
      </div>

      {admins.length === 0 ? (
        <div
          className={cn(
            "rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground sm:p-12",
          )}
        >
          Nenhum administrador cadastrado ainda.
        </div>
      ) : (
        <>
          <div className={cn("grid gap-3 sm:hidden")}>
            {admins.map((admin) => (
              <article
                key={admin.id}
                className={cn("rounded-lg border bg-background p-4")}
              >
                <div className={cn("flex items-start justify-between gap-3")}>
                  <div className={cn("min-w-0")}>
                    <h3 className={cn("truncate text-sm font-medium")}>
                      {admin.full_name}
                    </h3>
                    <p className={cn("mt-1 text-xs text-muted-foreground")}>
                      Desde {formatDate(admin.created_at)}
                    </p>
                  </div>
                  <Badge variant={ROLE_VARIANT[admin.role]}>
                    {ROLE_LABEL[admin.role]}
                  </Badge>
                </div>
              </article>
            ))}
          </div>

          <div
            className={cn("hidden overflow-x-auto rounded-lg border sm:block")}
          >
            <table className={cn("w-full min-w-[32rem] text-sm")}>
              <thead>
                <tr className={cn("border-b bg-muted/50")}>
                  <th
                    className={cn(
                      "px-4 py-3 text-left font-medium text-muted-foreground",
                    )}
                  >
                    Nome
                  </th>
                  <th
                    className={cn(
                      "px-4 py-3 text-left font-medium text-muted-foreground",
                    )}
                  >
                    Permissão
                  </th>
                  <th
                    className={cn(
                      "px-4 py-3 text-left font-medium text-muted-foreground",
                    )}
                  >
                    Desde
                  </th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, index) => (
                  <tr
                    key={admin.id}
                    className={cn("border-b last:border-0", {
                      "bg-muted/20": index % 2 !== 0,
                    })}
                  >
                    <td className={cn("px-4 py-3 font-medium")}>
                      {admin.full_name}
                    </td>
                    <td className={cn("px-4 py-3")}>
                      <Badge variant={ROLE_VARIANT[admin.role]}>
                        {ROLE_LABEL[admin.role]}
                      </Badge>
                    </td>
                    <td className={cn("px-4 py-3 text-muted-foreground")}>
                      {formatDate(admin.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
