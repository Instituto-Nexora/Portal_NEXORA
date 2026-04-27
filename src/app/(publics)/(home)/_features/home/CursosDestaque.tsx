import { BookOpen } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Curso = {
  id: string
  title: string
  description: string
  href: string
}

type CursosDestaqueProps = {
  cursos: Curso[]
}

export function CursosDestaque({ cursos }: CursosDestaqueProps) {
  return (
    <section className={cn("py-20 px-6 bg-gray-50")} id="cursos" aria-labelledby="cursos-title">
      <div className={cn("max-w-5xl mx-auto")}>
        <div className={cn("text-center mb-12")}>
          <h2 id="cursos-title" className={cn("text-3xl font-bold text-blue-900 mb-3")}>
            Cursos em Destaque
          </h2>
          <p className={cn("text-gray-500 max-w-md mx-auto")}>
            Capacitação profissional acessível para transformar sua carreira em TI.
          </p>
        </div>
        <ul className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0")}>
          {cursos.map((curso) => (
            <li key={curso.id} className={cn("flex")}>
              <Card
                className={cn(
                  "flex flex-col flex-1 border-l-4 border-l-emerald-500",
                  "hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
                )}
              >
                <CardHeader>
                  <div className={cn("flex items-center gap-2 mb-2")}>
                    <Badge variant="outline" className={cn("border-emerald-200 bg-emerald-50 text-emerald-700 gap-1")}>
                      <BookOpen className="size-3" />
                      Curso
                    </Badge>
                  </div>
                  <CardTitle className={cn("text-blue-900")}>{curso.title}</CardTitle>
                </CardHeader>
                <CardContent className={cn("flex-1")}>
                  <CardDescription className={cn("text-gray-600 text-sm leading-relaxed")}>
                    {curso.description}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button
                    size="sm"
                    className={cn("bg-emerald-500 hover:bg-emerald-600 text-white border-0 w-full")}
                    render={<Link href={curso.href} />}
                  >
                    Saiba Mais
                  </Button>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}