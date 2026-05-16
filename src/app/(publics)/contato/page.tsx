import type { Metadata } from "next";
import Contact from "./_features/view";

export const metadata: Metadata = {
  title: "Contato - NEXORA",
  description: "Entre em contato conosco para saber mais sobre nossos cursos, tirar dúvidas ou apoiar nossos projetos.",
};

export default function ContatoPage() {
  return (
    <main className="py-20 px-6 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-teal-600 text-sm font-semibold tracking-widest uppercase block mb-2">
            Fale Conosco
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Como podemos te ajudar?
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Preencha o formulário abaixo e nossa equipe entrará em contato o mais rápido possível.
          </p>
        </div>
        <Contact />
      </div>
    </main>
  );
}