"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useContactViewModel from "./viewModel";

export default function Contact() {
  const { form, isSubmitting, isSuccess, onSubmit } = useContactViewModel();

  return (
    <section className="py-12 px-6 bg-slate-50 rounded-xl my-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center text-slate-900">
          Ficou com alguma dúvida?
        </h2>
        <p className="text-center text-slate-600 mb-8">
          Estamos aqui para ajudar você a dar o próximo passo na sua carreira de tecnologia. Envie sua mensagem e conversamos!
        </p>
        
        {isSuccess && (
          <div className="mb-8 p-4 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg text-center font-medium">
            Obrigado por nos procurar! Recebemos sua mensagem e retornaremos em breve.
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Input 
              placeholder="Como podemos te chamar?" 
              {...form.register("nome")} 
              disabled={isSubmitting}
              className={cn(form.formState.errors.nome && "border-red-500")}
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
              className={cn(form.formState.errors.email && "border-red-500")}
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
              placeholder="O que você gostaria de saber?"
              {...form.register("mensagem")}
              disabled={isSubmitting}
            />
            {form.formState.errors.mensagem && (
              <span className="text-red-500 text-sm mt-1 block">{form.formState.errors.mensagem.message}</span>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full font-semibold bg-amber-500 hover:bg-amber-400 text-teal-900 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando mensagem..." : "Enviar Mensagem"}
          </Button>
        </form>
      </div>
    </section>
  );
}