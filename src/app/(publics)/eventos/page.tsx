import { EventosGravados } from "./_features/eventos/EventosGravados"
import { HeroEventos } from "./_features/eventos/HeroEventos"
import { ProximosEventos } from "./_features/eventos/ProximosEventos"

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
  {
    id: "elas-na-robotica",
    title: "Elas na Robótica",
    description: "Evento sobre participação feminina na área de tecnologia e robótica.",
    imageUrl: "/images/PALESTRA4.png",
    imageAlt: "Evento Elas na Robótica",
    youtubeUrl: "https://www.youtube.com/watch?v=o0fsnAeaDyQ",
  },
]

export default function EventosPage() {
  return (
    <main>
      <HeroEventos />
      <ProximosEventos eventos={proximosEventos} />
      <EventosGravados eventos={eventosGravados} />
    </main>
  )
}
