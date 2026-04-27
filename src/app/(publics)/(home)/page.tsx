import { CursosDestaque } from "./_features/home/CursosDestaque"
import { HeroSection } from "./_features/home/HeroSection"
import { ImpactoSection } from "./_features/home/ImpactoSection"
import { ParceirosCTA } from "./_features/home/ParceirosCTA"
import { ProjetosSociais } from "./_features/home/ProjetosSociais"

const cursos = [
  {
    id: "informatica-basica",
    title: "Informática Básica",
    description: "Ideal para iniciantes e inclusão digital.",
    href: "#",
  },
  {
    id: "intro-programacao",
    title: "Introdução à Programação",
    description: "Aprenda lógica e desenvolvimento web.",
    href: "#",
  },
  {
    id: "empregabilidade-ti",
    title: "Empregabilidade em TI",
    description: "Prepare-se para o mercado de trabalho.",
    href: "#",
  },
]

const projetos = [
  {
    id: "inclusao-idosos",
    title: "Inclusão Digital para Idosos",
    description: "Capacitação tecnológica para melhor qualidade de vida.",
  },
  {
    id: "programacao-jovens",
    title: "Programação para Jovens",
    description: "Incentivando novas carreiras na tecnologia.",
  },
  {
    id: "ti-sustentavel",
    title: "TI Sustentável",
    description: "Projetos ambientais com apoio da tecnologia.",
  },
]

const impactoItems = [
  { id: "alunos", value: "+500", label: "Alunos Capacitados" },
  { id: "projetos", value: "+30", label: "Projetos Realizados" },
  { id: "parceiros", value: "+15", label: "Parceiros" },
]

export default function HomePage() {
  return (
    <main>
      <HeroSection
        title="Tecnologia que conecta, educa e transforma vidas"
        subtitle="Projetos sociais, cursos profissionalizantes e impacto real na comunidade."
        primaryCta={{ label: "Ver Cursos", href: "#cursos" }}
        secondaryCta={{ label: "Seja Parceiro", href: "#parceiros" }}
      />
      <CursosDestaque cursos={cursos} />
      <ProjetosSociais projetos={projetos} />
      <ImpactoSection items={impactoItems} />
      <ParceirosCTA />
    </main>
  )
}
