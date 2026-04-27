import { Globe, Heart, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Projeto = {
  id: string
  title: string
  description: string
}

type ProjetosSociaisProps = {
  projetos: Projeto[]
}

const iconMap: Record<string, typeof Heart> = {
  "1": Users,
  "2": Globe,
  "3": Heart,
}

export function ProjetosSociais({ projetos }: ProjetosSociaisProps) {
  return (
    <section className={cn("py-20 px-6 bg-white")} id="projetos" aria-labelledby="projetos-title">
      <div className={cn("max-w-5xl mx-auto")}>
        <div className={cn("text-center mb-12")}>
          <h2 id="projetos-title" className={cn("text-3xl font-bold text-blue-900 mb-3")}>
            Nossos Projetos
          </h2>
          <p className={cn("text-gray-500 max-w-md mx-auto")}>
            Iniciativas de impacto social que conectam tecnologia a comunidades reais.
          </p>
        </div>
        <ul className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0")}>
          {projetos.map((projeto) => {
            const Icon = iconMap[projeto.id] ?? Heart
            return (
              <li key={projeto.id} className={cn("flex")}>
                <Card
                  className={cn(
                    "flex-1 border-l-4 border-l-blue-600",
                    "hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
                  )}
                >
                  <CardHeader>
                    <div className={cn("flex items-center gap-3 mb-2")}>
                      <div className={cn("size-9 rounded-lg bg-blue-100 flex items-center justify-center")}>
                        <Icon className={cn("size-5 text-blue-600")} />
                      </div>
                      <CardTitle className={cn("text-blue-900")}>{projeto.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className={cn("text-gray-600 text-sm leading-relaxed")}>
                      {projeto.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}