"use client";

import { CheckCircle2, Monitor, Moon, Sun, Type } from "lucide-react";
import type { FontSizeMode, FontSizeOption } from "@/hooks/useChangeFont";
import type { ThemeMode } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type AccessibilityCardProps = {
  variant?: "cms" | "aluno";
  theme: ThemeMode;
  setTheme: (value: ThemeMode) => void;
  fontSize: FontSizeMode;
  fontOptions: FontSizeOption[];
  setFontSize: (value: FontSizeMode) => void;
};

const THEME_OPTIONS: { value: ThemeMode; label: string; Icon: React.ElementType }[] = [
  { value: "system", label: "Sistema", Icon: Monitor },
  { value: "light", label: "Claro", Icon: Sun },
  { value: "dark", label: "Escuro", Icon: Moon },
];

export function AccessibilityCard({
  variant = "cms",
  theme,
  setTheme,
  fontSize,
  fontOptions,
  setFontSize,
}: AccessibilityCardProps) {
  const isCms = variant === "cms";

  return (
    <Card id={isCms ? "preferencias" : undefined} className={cn(isCms && "overflow-hidden")}>
      <CardHeader>
        <CardTitle
          className={cn(
            "flex items-center gap-2",
            !isCms && "text-teal-900",
          )}
        >
          {!isCms && <Type className={cn("h-5 w-5 text-indigo-500")} />}
          {isCms ? "Acessibilidade visual" : "Acessibilidade"}
        </CardTitle>
        <CardDescription>
          {isCms
            ? "Preferências rápidas persistidas localmente para tema e tamanho geral da fonte."
            : "Personalize a experiência visual da plataforma."}
        </CardDescription>
      </CardHeader>

      <CardContent className={cn(isCms ? "grid gap-6" : "space-y-6")}>
        <div className={cn("space-y-3")}>
          <Label>{isCms ? "Tema" : "Tema Visual"}</Label>
          <div className={cn(isCms ? "grid gap-2 sm:grid-cols-3" : "flex flex-wrap gap-2")}>
            {THEME_OPTIONS.map(({ value, label, Icon }) => {
              const isActive = theme === value;
              return (
                <Button
                  key={value}
                  type="button"
                  variant={isActive ? "default" : "outline"}
                  onClick={() => setTheme(value)}
                  className={cn(
                    isCms ? "justify-start" : "",
                    !isCms && isActive && "bg-teal-600 hover:bg-teal-700",
                  )}
                >
                  {isCms ? (
                    isActive && <CheckCircle2 className={cn("size-4")} />
                  ) : (
                    <Icon className={cn("mr-2 h-4 w-4")} />
                  )}
                  {label}
                </Button>
              );
            })}
          </div>
        </div>

        {isCms && <Separator />}

        <div className={cn("space-y-3")}>
          <Label>Tamanho da {isCms ? "fonte" : "Fonte"}</Label>
          <div
            className={cn(
              isCms ? "grid gap-2 sm:grid-cols-2 lg:grid-cols-4" : "flex flex-wrap gap-2",
            )}
          >
            {fontOptions.map((option) => {
              const isActive = fontSize === option.value;
              return (
                <Button
                  key={option.value}
                  type="button"
                  variant={isActive ? "default" : "outline"}
                  onClick={() => setFontSize(option.value)}
                  className={cn(
                    isCms && "h-auto flex-col items-start gap-1 py-3",
                    !isCms && isActive && "bg-teal-600 hover:bg-teal-700",
                  )}
                >
                  <span>{option.label}</span>
                  {isCms && (
                    <span className={cn("text-xs opacity-75")}>{option.description}</span>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
