import Link from "next/link";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  stats: { id: string; value: string; label: string }[];
};

export function HeroSection({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  stats,
}: HeroSectionProps) {
  return (
    <section
      className={cn("bg-teal-900 text-white py-24 md:py-32 px-6")}
      aria-labelledby="hero-title"
    >
      <div
        className={cn(
          "max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 items-center",
        )}
      >
        <div className={cn("flex flex-col gap-6")}>
          <span
            className={cn(
              "text-amber-400 text-xs font-semibold tracking-widest uppercase",
            )}
          >
            Plataforma Educacional
          </span>
          <h1
            id="hero-title"
            className={cn(
              "text-5xl md:text-6xl font-black text-white leading-[1.1]",
            )}
          >
            {title}
          </h1>
          <p className={cn("text-teal-200 text-lg leading-relaxed max-w-lg")}>
            {subtitle}
          </p>
          <div className={cn("flex flex-wrap gap-3 mt-2")}>
            <Link
              href={primaryCta.href}
              className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-lg bg-amber-500 text-teal-900 text-base font-bold h-11 px-7",
                "hover:bg-amber-400 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300",
              )}
            >
              {primaryCta.label}
            </Link>
            <Link
              href={secondaryCta.href}
              className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-lg border border-teal-600 text-white text-base font-medium h-11 px-7",
                "hover:bg-teal-800 transition-colors",
              )}
            >
              {secondaryCta.label}
            </Link>
          </div>
        </div>

        <div className={cn("hidden md:flex flex-col items-center gap-8")}>
          <div
            className={cn(
              "w-full aspect-square max-w-xs rounded-2xl bg-teal-800 flex items-center justify-center",
            )}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 200 200"
              className={cn("w-40 h-40 opacity-60")}
              aria-hidden="true"
            >
              <circle
                cx="100"
                cy="70"
                r="36"
                fill="none"
                stroke="#5EEAD4"
                strokeWidth="3"
              />
              <path
                d="M64 130 Q100 105 136 130"
                fill="none"
                stroke="#5EEAD4"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <rect
                x="72"
                y="148"
                width="56"
                height="6"
                rx="3"
                fill="#5EEAD4"
                opacity="0.6"
              />
              <rect
                x="82"
                y="162"
                width="36"
                height="6"
                rx="3"
                fill="#5EEAD4"
                opacity="0.4"
              />
            </svg>
          </div>

          {stats?.length > 0 && (
            <div
              className={cn(
                "flex divide-x divide-teal-700 bg-teal-800/50 rounded-xl px-4 py-4 w-full",
              )}
            >
              {stats?.map((stat) => (
                <div
                  key={stat.id}
                  className={cn("flex flex-col items-center gap-1 flex-1 px-2")}
                >
                  <span className={cn("text-3xl font-black text-amber-400")}>
                    {stat.value}
                  </span>
                  <span
                    className={cn(
                      "text-teal-300 text-xs font-medium text-center",
                    )}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
