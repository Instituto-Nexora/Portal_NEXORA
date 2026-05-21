"use client";

import Link from "next/link";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import useNovoTicketViewModel from "./viewModel";
import { cn } from "@/lib/utils";

export default function NovoTicketView() {
  const { form, isPending, onSubmit } = useNovoTicketViewModel();
  const { register, formState: { errors } } = form;

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="shrink-0 text-teal-950">
          <Link href="/minha-area/tickets" aria-label="Voltar para a lista de tickets">
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-teal-950">Novo Ticket</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Descreva sua necessidade ou problema. Nossa equipe responderá o mais rápido possível.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
        {errors.root && (
          <div className="p-3 bg-red-50 text-red-700 text-sm font-medium rounded-md border border-red-200" role="alert">
            {errors.root.message}
          </div>
        )}

        {/* Campo Tópico */}
        <div className="space-y-2">
          <label htmlFor="topico" className="text-sm font-semibold text-teal-950">Assunto / Tópico</label>
          <select
            id="topico"
            className={cn(
              "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
              errors.topico ? "border-red-500 focus-visible:ring-red-500" : "border-input hover:border-teal-600"
            )}
            {...register("topico")}
            disabled={isPending}
            aria-invalid={!!errors.topico}
          >
            <option value="">Selecione o assunto relacionado...</option>
            <option value="aula">Dúvida sobre Aula / Conteúdo</option>
            <option value="cadastro">Problema com Cadastro / Acesso</option>
            <option value="curso">Dúvida sobre Compras / Cursos</option>
            <option value="eventos">Informações sobre Eventos</option>
            <option value="reclamacao">Reclamação</option>
          </select>
          {errors.topico && (
            <p className="text-xs text-red-500 font-medium">{errors.topico.message}</p>
          )}
        </div>

        {/* Campo Mensagem */}
        <div className="space-y-2">
          <label htmlFor="mensagem" className="text-sm font-semibold text-teal-950">Sua Mensagem</label>
          <textarea
            id="mensagem"
            rows={6}
            className={cn(
              "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y min-h-[120px] transition-colors",
              errors.mensagem ? "border-red-500 focus-visible:ring-red-500" : "border-input hover:border-teal-600"
            )}
            placeholder="Descreva detalhadamente como podemos te ajudar..."
            {...register("mensagem")}
            disabled={isPending}
            aria-invalid={!!errors.mensagem}
          />
          {errors.mensagem && (
            <p className="text-xs text-red-500 font-medium">{errors.mensagem.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" className="w-full sm:w-auto text-teal-900 border-teal-900 hover:bg-teal-50" disabled={isPending}>
            <Link href="/minha-area/tickets">Cancelar</Link>
          </Button>
          <Button type="submit" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-teal-950 font-bold transition-colors" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="mr-2 h-4 w-4" aria-hidden="true" />}
            {isPending ? "Processando..." : "Abrir Chamado"}
          </Button>
        </div>
      </form>
    </div>
  );
}