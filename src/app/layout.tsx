
import type { Metadata } from "next"
import { Outfit, JetBrains_Mono } from "next/font/google"
import "../components/layout/globals.css"
import { ThemeProvider } from "@/components/shared/ThemeProvider"

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexora — Tecnologia que Conecta e Transforma",
  description: "Plataforma educacional e serviços de TI com impacto social.",
  icons: {
    icon: "../app/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
