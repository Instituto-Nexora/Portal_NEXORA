import { CalendarDays, Clock, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Event } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { formatDateLong, formatTime } from "@/utils/formatDate";

type OutroEvento = Pick<Event, "id" | "slug" | "title" | "description" | "type" | "scheduled_at" | "thumbnail_url">;

type Props = {
  evento: Event;
  outrosEventos: OutroEvento[];
};

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0];
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/live/")) return u.pathname.split("/live/")[1].split("?")[0];
      return u.searchParams.get("v");
    }
    return null;
  } catch {
    return null;
  }
}

export function EventoDetalheView({ evento, outrosEventos }: Props) {
  const videoId = evento.youtube_url ? getYouTubeId(evento.youtube_url) : null;

  return (
    <main>
      <div className={cn("max-w-6xl mx-auto px-6 pt-10")}>
        <Link
          href="/eventos"
          className={cn("text-sm text-teal-700 hover:underline mb-6 inline-block")}
        >
          ← Voltar para Eventos
        </Link>
      </div>

      <div className={cn("max-w-6xl mx-auto px-6 mb-8")}>
        {videoId ? (
          <div className={cn("relative w-full aspect-video rounded-xl overflow-hidden bg-black")}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
              title={evento.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className={cn("absolute inset-0 w-full h-full border-0")}
            />
          </div>
        ) : (
          <div className={cn("relative w-full aspect-video rounded-xl overflow-hidden")}>
            <Image
              src={evento.thumbnail_url ?? "/images/event-placeholder.jpg"}
              alt={evento.title}
              fill
              priority
              className={cn("object-cover")}
            />
          </div>
        )}
      </div>

      <div className={cn("max-w-6xl mx-auto px-6 pb-12")}>
        <div className={cn("flex flex-wrap gap-2 mb-4")}>
          {evento.type === "ao_vivo" ? (
            <Badge className={cn("bg-amber-500 text-white border-0 gap-1")}>
              <Video className={cn("size-3")} aria-hidden="true" />
              Ao Vivo
            </Badge>
          ) : (
            <Badge className={cn("bg-teal-100 text-teal-700 border-0 gap-1")}>
              <Video className={cn("size-3")} aria-hidden="true" />
              Gravado
            </Badge>
          )}

          {evento.scheduled_at && (
            <>
              <Badge variant="outline" className={cn("gap-1")}>
                <CalendarDays className={cn("size-3")} aria-hidden="true" />
                {formatDateLong(evento.scheduled_at)}
              </Badge>
              <Badge variant="outline" className={cn("gap-1")}>
                <Clock className={cn("size-3")} aria-hidden="true" />
                {formatTime(evento.scheduled_at)}
              </Badge>
            </>
          )}

          {evento.duration_minutes && (
            <Badge variant="outline">{evento.duration_minutes} min</Badge>
          )}
        </div>

        <h1 className={cn("text-3xl font-bold text-slate-900 mb-4")}>
          {evento.title}
        </h1>
        <p className={cn("text-lg text-slate-600 mb-6")}>{evento.description}</p>

        {evento.long_description && (
          <div className={cn("mb-8 text-slate-700 leading-relaxed whitespace-pre-line")}>
            {evento.long_description}
          </div>
        )}
      </div>

      {outrosEventos.length > 0 && (
        <div className={cn("max-w-6xl mx-auto px-6 pb-16")}>
          <h2 className={cn("text-xl font-bold text-slate-900 mb-6")}>Outros eventos</h2>
          <ul className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0")}>
            {outrosEventos.map((outro) => (
              <li key={outro.id}>
                <Link href={`/eventos/${outro.slug}`} className={cn("group block h-full")}>
                  <Card className={cn("h-full overflow-hidden border-t-4 border-t-teal-600 pt-0 hover:shadow-md hover:-translate-y-1 transition-all duration-300")}>
                    <div className={cn("relative w-full aspect-video overflow-hidden")}>
                      <Image
                        src={outro.thumbnail_url ?? "/images/event-placeholder.jpg"}
                        alt={outro.title}
                        fill
                        className={cn("object-cover group-hover:scale-105 transition-transform duration-300")}
                      />
                    </div>
                    <CardHeader className={cn("pb-2")}>
                      <div className={cn("flex items-center gap-2 mb-1")}>
                        <Badge
                          className={cn(
                            outro.type === "ao_vivo"
                              ? "bg-amber-500 text-white border-0 gap-1"
                              : "bg-teal-100 text-teal-700 border-0 gap-1",
                          )}
                        >
                          <Video className={cn("size-3")} aria-hidden="true" />
                          {outro.type === "ao_vivo" ? "Ao Vivo" : "Gravado"}
                        </Badge>
                        {outro.scheduled_at && (
                          <Badge variant="outline" className={cn("gap-1 text-xs")}>
                            <CalendarDays className={cn("size-3")} aria-hidden="true" />
                            {formatDateLong(outro.scheduled_at)}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className={cn("text-sm leading-snug text-slate-900")}>
                        {outro.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={cn("text-xs text-slate-500 leading-relaxed")}>
                      {outro.description}
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
