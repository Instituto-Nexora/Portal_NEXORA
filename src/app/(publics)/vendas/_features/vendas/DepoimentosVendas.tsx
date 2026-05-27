import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

type Depoimento = {
  id: string
  quote: string
  author: string
  role: string
  avatarInitials: string
  resultado?: string
}

const depoimentos: Depoimento[] = [
  {
    id: "dep-001",
    quote:
      "Eu estava desempregado há 8 meses quando comecei o curso de Segurança da Informação. A didática é diferente de tudo que já vi: prática desde o primeiro dia. Antes de terminar, já tinha recebido uma proposta.",
    author: "Carlos Eduardo Martins",
    role: "Analista de Segurança — formado em 2025",
    avatarInitials: "CE",
    resultado: "Contratado antes de concluir o curso",
  },
  {
    id: "dep-002",
    quote:
      "Sempre tive medo de tecnologia. O suporte do Nexora foi fundamental — cada dúvida respondida rapidamente, cada desafio virou um aprendizado. Hoje lidero projetos de BI na empresa onde trabalho.",
    author: "Fernanda Oliveira",
    role: "Analista de Dados — formada em 2024",
    avatarInitials: "FO",
    resultado: "Promovida 3 meses após a conclusão",
  },
  {
    id: "dep-003",
    quote:
      "O mercado de TI parecia inacessível para alguém da minha realidade. O Nexora não só me ensinou a programar — me ensinou a pensar como um profissional. Hoje sou desenvolvedor e ajudo a pagar os estudos dos meus irmãos.",
    author: "Lucas Ferreira dos Santos",
    role: "Desenvolvedor Web — formado em 2025",
    avatarInitials: "LF",
    resultado: "Primeiro emprego em TI conquistado em 2 meses",
  },
]

export function DepoimentosVendas() {
  return (
    <section
      className={cn("py-20 px-6 bg-slate-50")}
      aria-labelledby="depoimentos-vendas-title"
    >
      <div className={cn("max-w-5xl mx-auto")}>
        <div className={cn("text-center mb-12")}>
          <h2
            id="depoimentos-vendas-title"
            className={cn("text-3xl font-bold text-slate-900 mb-3")}
          >
            Quem transformou a carreira com o Nexora
          </h2>
          <p className={cn("text-slate-500 max-w-xl mx-auto")}>
            Resultados reais de alunos que apostaram na mudança e chegaram lá.
          </p>
        </div>

        <ul
          className={cn(
            "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0",
          )}
        >
          {depoimentos.map((dep) => (
            <li key={dep.id} className={cn("flex")}>
              <article
                className={cn(
                  "flex flex-col gap-4 flex-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm",
                )}
              >
                <div
                  className={cn("flex gap-0.5")}
                  aria-label="5 estrelas"
                  role="img"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn("size-4 fill-amber-400 text-amber-400")}
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <blockquote
                  className={cn(
                    "text-slate-700 italic text-base leading-relaxed flex-1",
                  )}
                >
                  &ldquo;{dep.quote}&rdquo;
                </blockquote>

                <footer className={cn("flex flex-col gap-3 mt-auto")}>
                  {dep.resultado && (
                    <span
                      className={cn(
                        "inline-flex w-fit items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-600/20",
                      )}
                    >
                      <span aria-hidden="true">✓</span>
                      {dep.resultado}
                    </span>
                  )}

                  <div className={cn("flex items-center gap-3")}>
                    <div
                      className={cn(
                        "size-10 rounded-full bg-teal-700 text-white flex items-center justify-center text-sm font-bold shrink-0",
                      )}
                      aria-hidden="true"
                    >
                      {dep.avatarInitials}
                    </div>
                    <div>
                      <p className={cn("text-slate-900 font-semibold text-sm")}>
                        {dep.author}
                      </p>
                      <p className={cn("text-teal-600 text-xs")}>{dep.role}</p>
                    </div>
                  </div>
                </footer>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
