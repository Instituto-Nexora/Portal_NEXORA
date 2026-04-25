import { CalendarDays, Clock, Video } from "lucide-react"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ProximoEvento = {
  id: string
  title: string
  date: string
  time: string
  description: string
  imageUrl: string
  imageAlt: string
  youtubeUrl: string
}

type ProximosEventosProps = {
  eventos: ProximoEvento[]
}

export function ProximosEventos({ eventos }: ProximosEventosProps) {
  if (eventos.length === 0) {
    return (
      <section className={cn("py-20 px-6 bg-white")} aria-labelledby="proximos-title">
        <div className={cn("max-w-5xl mx-auto text-center")}>
          <h2 id="proximos-title" className={cn("text-3xl font-bold text-blue-900 mb-4")}>
            Próximos Eventos
          </h2>
          <p className={cn("text-gray-500")}>Nenhum evento programado no momento. Fique de olho!</p>
        </div>
      </section>
    )
  }

  return (
    <section className={cn("py-20 px-6 bg-white")} aria-labelledby="proximos-title">
      <div className={cn("max-w-5xl mx-auto")}>
        <div className={cn("text-center mb-12")}>
          <h2 id="proximos-title" className={cn("text-3xl font-bold text-blue-900 mb-3")}>
            Próximos Eventos
          </h2>
          <p className={cn("text-gray-500")}>Inscreva-se e participe ao vivo.</p>
        </div>
        <ul className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0")}>
          {eventos.map((evento) => (
            <li key={evento.id} className={cn("flex")}>
              <Card
                className={cn(
                  "flex flex-col flex-1 overflow-hidden border-t-4 border-t-emerald-500",
                  "hover:shadow-lg hover:-translate-y-1 transition-all duration-300 pt-0",
                )}
              >
                <div className={cn("relative")}>
                  <Image
                    src={evento.imageUrl}
                    alt={evento.imageAlt}
                    width={400}
                    height={220}
                    className={cn("w-full h-48 object-cover")}
                  />
              
                </div>
                <CardHeader>
                  <div className={cn("flex gap-2 flex-wrap mb-1")}>
                    <Badge className={cn("bg-blue-100 text-blue-700 border-blue-200 gap-1")}>
                      <CalendarDays className="size-3" />
                      {evento.date}
                    </Badge>
                    <Badge variant="outline" className={cn("gap-1")}>
                      <Clock className="size-3" />
                      {evento.time}
                    </Badge>
                    <Badge className={cn("bg-emerald-500 text-white border-0 gap-1 shadow-sm")}>
                      <Video className="size-3" />
                      Ao Vivo
                    </Badge>
                  </div>
                  <CardTitle className={cn("text-blue-900 text-base")}>{evento.title}</CardTitle>
                </CardHeader>
                <CardContent className={cn("flex-1 text-sm text-gray-600 leading-relaxed")}>
                  {evento.description}
                </CardContent>
                <CardFooter>
                  <a
                    href={evento.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white text-sm font-medium h-7 gap-1 px-2.5",
                      "hover:bg-emerald-600 transition-colors w-full text-center",
                    )}
                  >
                    Participar ao Vivo
                  </a>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}