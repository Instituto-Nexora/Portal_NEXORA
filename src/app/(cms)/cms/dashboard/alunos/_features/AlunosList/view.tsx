import { cn } from "@/lib/utils";

type StudentRow = {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
};

type Props = {
  alunos: StudentRow[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function AlunosListView({ alunos }: Props) {
  return (
    <div className={cn("space-y-6")}>
      <div
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        )}
      >
        <div>
          <h2 className={cn("text-xl font-bold tracking-tight sm:text-2xl")}>
            Alunos
          </h2>
          <p className={cn("text-sm text-muted-foreground")}>
            {alunos.length} aluno{alunos.length !== 1 ? "s" : ""} cadastrado
            {alunos.length !== 1 ? "s" : ""}.
          </p>
        </div>
      </div>

      {alunos.length === 0 ? (
        <div
          className={cn(
            "rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground sm:p-12",
          )}
        >
          Nenhum aluno cadastrado ainda.
        </div>
      ) : (
        <>
          <div className={cn("grid gap-3 sm:hidden")}>
            {alunos.map((aluno) => (
              <article
                key={aluno.id}
                className={cn("rounded-lg border bg-background p-4")}
              >
                <div className={cn("min-w-0")}>
                  <h3 className={cn("truncate text-sm font-medium")}>
                    {aluno.full_name}
                  </h3>
                  <p
                    className={cn(
                      "mt-1 truncate text-xs text-muted-foreground",
                    )}
                  >
                    {aluno.email}
                  </p>
                  <p className={cn("mt-1 text-xs text-muted-foreground")}>
                    Desde {formatDate(aluno.created_at)}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div
            className={cn("hidden overflow-x-auto rounded-lg border sm:block")}
          >
            <table className={cn("w-full min-w-[40rem] text-sm")}>
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
                    E-mail
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
                {alunos.map((aluno, index) => (
                  <tr
                    key={aluno.id}
                    className={cn("border-b last:border-0", {
                      "bg-muted/20": index % 2 !== 0,
                    })}
                  >
                    <td className={cn("px-4 py-3 font-medium")}>
                      {aluno.full_name}
                    </td>
                    <td className={cn("px-4 py-3 text-muted-foreground")}>
                      {aluno.email}
                    </td>
                    <td className={cn("px-4 py-3 text-muted-foreground")}>
                      {formatDate(aluno.created_at)}
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
