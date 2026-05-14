import type { Metadata } from "next";
import Contact from "./_features/view";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Contato - NEXORA",
  description: "Entre em contato conosco para saber mais sobre nossos cursos, tirar dúvidas ou apoiar nossos projetos sociais.",
};

export default function ContatoPage() {
  return (
    <main className="py-20 px-6 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho da Página */}
        <div className="text-center mb-16">
          <span className="text-teal-600 text-sm font-semibold tracking-widest uppercase block mb-2">
            Fale Conosco
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Como podemos te ajudar?
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Estamos sempre abertos para ouvir você. Seja para tirar dúvidas sobre os cursos, propor parcerias ou apoiar nossos projetos sociais!
          </p>
        </div>

        {/* Cards de Informação de Contato */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
            <div className="size-14 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mb-6">
              <Mail className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">E-mail</h3>
            <p className="text-slate-600">contato@nexora.com.br</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
            <div className="size-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
              <Phone className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Telefone</h3>
            <p className="text-slate-600">(11) 99999-9999</p>
          </div>

          <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
            <div className="size-14 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mb-6">
              <MapPin className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Endereço</h3>
            <p className="text-slate-600">São Paulo, SP - Brasil</p>
          </div>
        </div>

        {/* Componente de Formulário Reutilizável encapsulado */}
        <div className="bg-white shadow-xl shadow-slate-200/40 rounded-2xl border border-slate-100 p-2 md:p-4">
          <Contact />
        </div>
      </div>
    </main>
  );
}
