import { CalendarDays, Clock, PlayCircle, Video } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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

type EventoGravado = {
  id: string
  title: string
  description: string
  imageUrl: string
  imageAlt: string
  youtubeUrl: string
}

type EventosSectionProps = {
  proximosEventos: ProximoEvento[]
  eventosGravados: EventoGravado[]
}

export function EventosSection({ proximosEventos, eventosGravados }: EventosSectionProps) {
  return (
    <section className={cn("py-20 px-6 bg-slate-50")} id="eventos" aria-labelledby="eventos-home-title">
      <div className={cn("max-w-5xl mx-auto")}>

        <div className={cn("flex items-end justify-between mb-12 gap-4 flex-wrap")}>
          <div>
            <span className={cn("text-teal-600 text-xs font-semibold tracking-widest uppercase block mb-2")}>
              Ao vivo & Gravados
            </span>
            <h2 id="eventos-home-title" className={cn("text-3xl font-bold text-slate-900")}>
              Eventos
            </h2>
          </div>
          <Link
            href="/eventos"
            className={cn("text-sm font-semibold text-teal-700 hover:text-teal-600 underline-offset-4 hover:underline transition-colors shrink-0")}
          >
            Ver todos os eventos →
          </Link>
        </div>

        {proximosEventos.length > 0 && (
          <div className={cn("mb-14")}>
            <h3 className={cn("text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2")}>
              <span className={cn("size-2 rounded-full bg-amber-500 animate-pulse")} aria-hidden="true" />
              Próximos Eventos
            </h3>
            <ul className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0")}>
              {proximosEventos.map((evento) => (
                <li key={evento.id} className={cn("flex")}>
                  <Card
                    className={cn(
                      "flex flex-col flex-1 overflow-hidden border-t-4 border-t-amber-500 pt-0",
                      "hover:shadow-md hover:-translate-y-1 transition-all duration-300",
                    )}
                  >
                    <div className={cn("relative")}>
                      <Image
                        src={evento.imageUrl}
                        alt={evento.imageAlt}
                        width={400}
                        height={220}
                        className={cn("w-full h-44 object-cover")}
                      />
                    </div>
                    <CardHeader>
                      <div className={cn("flex gap-2 flex-wrap mb-1")}>
                        <Badge className={cn("bg-teal-100 text-teal-700 border-0 gap-1")}>
                          <CalendarDays className={cn("size-3")} aria-hidden="true" />
                          {evento.date}
                        </Badge>
                        <Badge variant="outline" className={cn("gap-1")}>
                          <Clock className={cn("size-3")} aria-hidden="true" />
                          {evento.time}
                        </Badge>
                        <Badge className={cn("bg-amber-500 text-white border-0 gap-1")}>
                          <Video className={cn("size-3")} aria-hidden="true" />
                          Ao Vivo
                        </Badge>
                      </div>
                      <CardTitle className={cn("text-slate-900 text-base")}>{evento.title}</CardTitle>
                    </CardHeader>
                    <CardContent className={cn("flex-1 text-sm text-slate-600 leading-relaxed")}>
                      {evento.description}
                    </CardContent>
                    <CardFooter>
                      <a
                        href={evento.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "inline-flex items-center justify-center rounded-lg bg-amber-500 text-teal-900 text-sm font-bold h-8 gap-1.5 px-3 w-full",
                          "hover:bg-amber-400 transition-colors",
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
        )}

        {eventosGravados.length > 0 && (
          <div>
            <h3 className={cn("text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2")}>
              <PlayCircle className={cn("size-4 text-teal-600")} aria-hidden="true" />
              Eventos Gravados
            </h3>
            <ul className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0")}>
              {eventosGravados.map((evento) => (
                <li key={evento.id} className={cn("flex")}>
                  <Card
                    className={cn(
                      "flex flex-col flex-1 overflow-hidden border-t-4 border-t-teal-600 pt-0",
                      "hover:shadow-md hover:-translate-y-1 transition-all duration-300 group",
                    )}
                  >
                    <a
                      href={evento.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Assistir: ${evento.title}`}
                      className={cn("relative block overflow-hidden aspect-video")}
                    >
                      <Image
                        src={evento.imageUrl}
                        alt={evento.imageAlt}
                        fill
                        className={cn("object-cover group-hover:scale-105 transition-transform duration-300")}
                      />
                      <div
                        className={cn(
                          "absolute inset-0 bg-teal-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                        )}
                        aria-hidden="true"
                      >
                        <PlayCircle className={cn("size-12 text-white")} />
                      </div>
                    </a>
                    <CardHeader>
                      <div className={cn("flex items-center gap-2 mb-1")}>
                        <Badge className={cn("bg-teal-100 text-teal-700 border-0 gap-1")}>
                          <Video className={cn("size-3")} aria-hidden="true" />
                          Gravado
                        </Badge>
                      </div>
                      <CardTitle className={cn("text-slate-900 text-sm leading-snug")}>{evento.title}</CardTitle>
                    </CardHeader>
                    <CardContent className={cn("flex-1 text-xs text-slate-500 leading-relaxed")}>
                      {evento.description}
                    </CardContent>
                    <CardFooter>
                      <a
                        href={evento.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "inline-flex items-center justify-center rounded-lg border border-teal-700 text-teal-700 text-sm font-semibold h-8 gap-1.5 px-3 w-full",
                          "hover:bg-teal-700 hover:text-white transition-colors",
                        )}
                      >
                        <PlayCircle className={cn("size-3.5")} aria-hidden="true" />
                        Assistir
                      </a>
                    </CardFooter>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        )}

        {proximosEventos.length === 0 && eventosGravados.length === 0 && (
          <p className={cn("text-center text-slate-500 py-12")}>
            Nenhum evento disponível no momento. Fique de olho!
          </p>
        )}

      </div>
    </section>
  )
}
