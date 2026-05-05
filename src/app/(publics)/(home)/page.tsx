import { CursosDestaque } from "./_features/home/CursosDestaque"
import { HeroSection } from "./_features/home/HeroSection"
import { ImpactoSection } from "./_features/home/ImpactoSection"
import { ParceirosCTA } from "./_features/home/ParceirosCTA"
import { ProjetosSociais } from "./_features/home/ProjetosSociais"
import { TestimonialsSection } from "./_features/home/TestimonialsSection"

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

const heroStats = [
  { id: "alunos", value: "+500", label: "Alunos" },
  { id: "projetos", value: "+30", label: "Projetos" },
  { id: "parceiros", value: "+15", label: "Parceiros" },
]

const proximosEventos = [
  {
    id: "live-seguranca-digital",
    title: "Live: Segurança Digital",
    date: "14/03/2026",
    time: "15:00",
    description: "Dicas importantes para proteger seus dados e navegar com segurança na internet.",
    imageUrl: "/images/live_segurança.jpeg",
    imageAlt: "Live Segurança Digital",
    youtubeUrl: "https://www.youtube.com/@SupimpaTI",
  },
]

const eventosGravados = [
  {
    id: "ciencia-dados-ml",
    title: "Ciência de Dados e Machine Learning",
    description: "A importância da análise de dados.",
    imageUrl: "/images/PALESTRA1.jpg",
    imageAlt: "Palestra sobre Ciência de Dados",
    youtubeUrl: "https://www.youtube.com/watch?v=ubbj7slAlGM&t=12s",
  },
  {
    id: "desenvolvendo-com-seguranca",
    title: "Desenvolvendo com Segurança",
    description: "Princípios de Cyber Segurança para Devs.",
    imageUrl: "/images/PALESTRA2.jpeg",
    imageAlt: "Palestra sobre Desenvolvimento Seguro",
    youtubeUrl: "https://www.youtube.com/watch?v=Wwet0QK8yJU",
  },
  {
    id: "github-portfolio",
    title: "Como utilizar o Github para alavancar seu portfólio",
    description: "Aprenda como utilizar o GitHub para destacar seus projetos.",
    imageUrl: "/images/PALESTRA3.jpg",
    imageAlt: "Palestra sobre GitHub para portfólio",
    youtubeUrl: "https://www.youtube.com/watch?v=IZyad7yAiOk",
  },
]

const testimonials = [
  {
    id: "ms",
    quote: "O curso de Informática Básica mudou minha vida. Consegui meu primeiro emprego em TI depois de 3 meses.",
    author: "Maria Silva",
    role: "Aluna · Informática Básica",
    avatarInitials: "MS",
  },
  {
    id: "cr",
    quote: "A didática é excelente e o suporte da equipe faz toda a diferença. Me sinto parte de uma comunidade.",
    author: "Carlos Rocha",
    role: "Aluno · Introdução à Programação",
    avatarInitials: "CR",
  },
  {
    id: "af",
    quote: "Nunca imaginei que aprenderia a programar. O Portal Nexora tornou isso possível e acessível para mim.",
    author: "Ana Ferreira",
    role: "Aluna · Empregabilidade em TI",
    avatarInitials: "AF",
  },
]

export default function HomePage() {
  return (
    <main>
      <HeroSection
        title="Tecnologia que conecta, educa e transforma vidas"
        subtitle="Projetos sociais, cursos profissionalizantes e impacto real na comunidade."
        primaryCta={{ label: "Ver Cursos", href: "#cursos" }}
        secondaryCta={{ label: "Seja Parceiro", href: "#parceiros" }}
        stats={heroStats}
      />
      <ImpactoSection items={impactoItems} />
      <CursosDestaque cursos={cursos} />
      <ProjetosSociais projetos={projetos} />
      {/* <EventosSection proximosEventos={proximosEventos} eventosGravados={eventosGravados} /> */}

      <TestimonialsSection testimonials={testimonials} />
      <ParceirosCTA />
    </main>
  )
}
