import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

type Testimonial = {
  id: string
  quote: string
  author: string
  role: string
  avatarInitials: string
}

type TestimonialsSectionProps = {
  testimonials: Testimonial[]
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className={cn("py-20 px-6 bg-white")} aria-labelledby="testimonials-title">
      <div className={cn("max-w-5xl mx-auto")}>
        <div className={cn("text-center mb-12")}>
          <h2 id="testimonials-title" className={cn("text-3xl font-bold text-slate-900 mb-3")}>
            O que nossos alunos dizem
          </h2>
          <p className={cn("text-slate-500 max-w-md mx-auto")}>
            Histórias reais de quem transformou sua vida com tecnologia.
          </p>
        </div>
        <ul className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0")}>
          {testimonials.map((t) => (
            <li key={t.id} className={cn("flex")}>
              <article className={cn("flex flex-col gap-4 flex-1 bg-slate-50 border border-slate-200 rounded-xl p-6")}>
                <div className={cn("flex gap-0.5")} aria-label="5 estrelas" role="img">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn("size-4 text-amber-400 fill-amber-400")}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote className={cn("text-slate-700 italic text-base leading-relaxed flex-1")}>
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <footer className={cn("flex items-center gap-3 mt-auto")}>
                  <div
                    className={cn("size-10 rounded-full bg-teal-700 text-white flex items-center justify-center text-sm font-bold shrink-0")}
                    aria-hidden="true"
                  >
                    {t.avatarInitials}
                  </div>
                  <div>
                    <p className={cn("text-slate-900 font-semibold text-sm")}>{t.author}</p>
                    <p className={cn("text-teal-600 text-xs")}>{t.role}</p>
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
