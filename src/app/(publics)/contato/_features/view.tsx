"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useContactViewModel from "./viewModel";

export default function Contact() {
  const { form, isSubmitting, isSuccess, error, onSubmit } = useContactViewModel();

  return (
    <div className="w-full">
      {isSuccess && (
        <div className="mb-6 p-4 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg text-center font-medium">
          Sua mensagem foi enviada com sucesso! Retornaremos em breve.
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input 
            placeholder="Seu nome completo" 
            {...form.register("nome")} 
            disabled={isSubmitting}
            className={cn(form.formState.errors.nome && "border-red-500 focus-visible:ring-red-500")}
          />
          {form.formState.errors.nome && (
            <span className="text-red-500 text-sm mt-1 block">{form.formState.errors.nome.message}</span>
          )}
        </div>
        
        <div>
          <Input 
            type="email" 
            placeholder="Seu melhor e-mail" 
            {...form.register("email")} 
            disabled={isSubmitting}
            className={cn(form.formState.errors.email && "border-red-500 focus-visible:ring-red-500")}
          />
          {form.formState.errors.email && (
            <span className="text-red-500 text-sm mt-1 block">{form.formState.errors.email.message}</span>
          )}
        </div>
        
        <div>
          <textarea
            className={cn(
              "flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              form.formState.errors.mensagem && "border-red-500 focus-visible:ring-red-500"
            )}
            placeholder="Como podemos te ajudar?"
            {...form.register("mensagem")}
            disabled={isSubmitting}
          />
          {form.formState.errors.mensagem && (
            <span className="text-red-500 text-sm mt-1 block">{form.formState.errors.mensagem.message}</span>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full font-bold bg-amber-500 hover:bg-amber-400 text-teal-900 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
        </Button>
      </form>
    </div>
  );
}
