"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const pathname = usePathname();
  
  // Verifica se a rota atual pertence às áreas logadas
  const isLoggedArea = pathname?.startsWith("/minha-area") || pathname?.startsWith("/cms");

  return (
    <NextThemesProvider 
      {...props} 
      forcedTheme={isLoggedArea ? undefined : "light"}
    >
      {children}
    </NextThemesProvider>
  );
}
