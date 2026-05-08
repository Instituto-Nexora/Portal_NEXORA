import { Camera, PlayCircle, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Event } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type Props = {
  eventos: Event[];
};

export function EventosGravados({ eventos }: Props) {
  if (eventos.length === 0) {
    return (
      <section
        className={cn("py-20 px-6 bg-slate-50")}
        aria-labelledby="gravados-title"
      >
        <div className={cn("max-w-5xl mx-auto text-center")}>
          <h2
            id="gravados-title"
            className={cn("text-3xl font-bold text-slate-900 mb-4")}
          >
            Eventos Gravados
          </h2>
          <p className={cn("text-slate-500")}>
            Nenhum evento gravado disponível ainda.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn("py-20 px-6 bg-slate-50")}
      aria-labelledby="gravados-title"
    >
      <div className={cn("max-w-5xl mx-auto")}>
        <div className={cn("text-center mb-12")}>
          <h2
            id="gravados-title"
            className={cn("text-3xl font-bold text-slate-900 mb-3")}
          >
            Eventos Gravados
          </h2>
          <p className={cn("text-slate-500")}>Assista quando e onde quiser.</p>
        </div>
        <ul
          className={cn(
            "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0",
          )}
        >
          {eventos.map((evento) => (
              <li key={evento.id} className={cn("flex")}>
                <Card
                  className={cn(
                    "flex flex-col flex-1 overflow-hidden border-t-4 border-t-teal-600 pt-0",
                    "hover:shadow-md hover:-translate-y-1 transition-all duration-300 group",
                  )}
                >
                  <Link
                    href={`/eventos/${evento.slug}`}
                    aria-label={`Ver detalhes: ${evento.title}`}
                    className={cn("relative block overflow-hidden aspect-video")}
                  >
                    {evento.thumbnail_url ? (
                      <>
                        <Image
                          src={evento.thumbnail_url}
                          alt={evento.title}
                          fill
                          className={cn(
                            "object-cover group-hover:scale-105 transition-transform duration-300",
                          )}
                        />
                        <div
                          className={cn(
                            "absolute inset-0 bg-teal-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                          )}
                          aria-hidden="true"
                        >
                          <PlayCircle className={cn("size-12 text-white")} />
                        </div>
                      </>
                    ) : (
                      <div
                        className={cn(
                          "w-full h-full bg-slate-100 flex items-center justify-center",
                        )}
                        aria-hidden="true"
                      >
                        <Camera className={cn("size-10 text-slate-300")} />
                      </div>
                    )}
                  </Link>
                  <CardHeader>
                    <div className={cn("flex items-center gap-2 mb-1")}>
                      <Badge
                        className={cn(
                          "bg-teal-100 text-teal-700 border-0 gap-1",
                        )}
                      >
                        <Video className={cn("size-3")} aria-hidden="true" />
                        Gravado
                      </Badge>
                    </div>
                    <CardTitle
                      className={cn("text-slate-900 text-sm leading-snug")}
                    >
                      {evento.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent
                    className={cn(
                      "flex-1 text-xs text-slate-500 leading-relaxed",
                    )}
                  >
                    {evento.description}
                  </CardContent>
                  <CardFooter>
                    <Link
                      href={`/eventos/${evento.slug}`}
                      className={cn(
                        "inline-flex items-center justify-center rounded-lg border border-teal-700 text-teal-700 text-sm font-semibold h-8 gap-1.5 px-3 w-full",
                        "hover:bg-teal-700 hover:text-white transition-colors",
                      )}
                    >
                      <PlayCircle className={cn("size-3.5")} aria-hidden="true" />
                      Assistir
                    </Link>
                  </CardFooter>
                </Card>
              </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
