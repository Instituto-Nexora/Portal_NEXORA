# Portal NEXORA

Portal NEXORA é o portal público e institucional do Instituto Nexora, focado em divulgação de eventos, iniciativas, conteúdos educacionais e informações da organização em um ambiente moderno, rápido e otimizado para SEO.

O projeto é construído em cima do **Next.js** (App Router) e segue uma arquitetura opinativa voltada para escalabilidade, colaboração em squads e integração futura com um ecossistema mais amplo de produtos Nexora.

---

# Sumário

Navegue livremente pela documentação clicando nas seções abaixo:

- [Objetivo do projeto](#objetivo-do-projeto)
- [Visão funcional](#visão-funcional)
- [Arquitetura e estrutura de pastas](#arquitetura-e-estrutura-de-pastas)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Tecnologias planejadas / futuras integrações](#tecnologias-planejadas--futuras-integrações)
- [Rotas importantes](#rotas-importantes)
- [Funcionalidades já implementadas](#funcionalidades-já-implementadas)
- [Funcionalidades pendentes / em desenvolvimento](#funcionalidades-pendentes--em-desenvolvimento)
- [Funcionalidades em stand by](#funcionalidades-em-stand-by)
- [Deploy](#deploy)
- [Contribuição](#contribuição)
- [Time e perfis de contribuição](#time-e-perfis-de-contribuição)
- [Documentação complementar](#documentação-complementar)

---

## Objetivo do projeto

- Criar o portal oficial do Instituto Nexora, centralizando eventos, notícias e informações institucionais em uma única plataforma.  
- Oferecer uma vitrine digital para programas, formações, projetos de impacto social e oportunidades de engajamento com o instituto.  
- Integrar o portal a um CMS e a serviços de autenticação para que times internos possam gerenciar conteúdo com autonomia, mantendo governança e rastreabilidade de mudanças.  
- Estabelecer uma base sólida de frontend para futura expansão em módulos, microsserviços e integrações com outros sistemas do ecossistema Nexora.

---

## Visão funcional

Hoje o Portal NEXORA já contempla a base do site público em Next.js, com layout e componentes alinhados à identidade visual Deep Teal + Amber do Instituto Nexora, e com fluxo completo de listagem e exibição de eventos integrados a um CMS.  
A documentação em `docs/` descreve o MVP, contexto de negócio, specs técnicas e um protocolo de mudanças (CHANGE GUARD) para acompanhar a evolução do produto.

Principais capacidades implementadas ou em andamento:

- Home institucional com hero, destaques e navegação principal.  
- Listagem e detalhamento de eventos, com fluxo completo CMS + plataforma pública.  
- Base de autenticação e dashboard CMS integrados com Supabase para gestão de conteúdo (login, registro e acesso administrativo).  
- Estrutura de documentação viva (business, specs, tech-context, tech) integrada ao repositório para alinhamento entre produto, negócio e engenharia.  

---

## Arquitetura e estrutura de pastas

A estrutura de código segue o padrão App Router do Next.js, com separação clara entre app, componentes reutilizáveis, bibliotecas de domínio e utilitários.

```bash
src/
  app/          # Rotas, layouts e entrypoints da aplicação Next.js
  components/   # Componentes de UI reutilizáveis, layouts e building blocks
  lib/          # Funções de domínio, integrações (ex.: Supabase, CMS, etc.)
  utils/        # Funções utilitárias, helpers, formatadores, etc.
  proxy.ts      # Proxy/handler para integração com serviços externos e/ou middlewares
docs/
  _memory/      # Contexto histórico e memórias do projeto
  business/     # Documentos de negócio, visão de produto, alinhamento estratégico
  specs/        # Especificações funcionais/técnicas, incluindo fluxo de auth CMS
  tech-context/ # Contexto técnico, decisões de arquitetura e trade-offs
  tech/         # Documentação de implementação, guias técnicos
  CHANGELOG.md  # Histórico de mudanças e releases funcionais
  index.md      # Índice principal de documentação
  pre-prd.md    # Checklist e contexto de ambiente pré-produção
```

---

## Tecnologias utilizadas

Principais tecnologias identificadas no projeto:

- **Next.js (App Router)** – Framework React para renderização híbrida (SSR/SSG), rotas em `app/` e otimizações nativas.  
- **TypeScript** – Linguagem principal do código, representando ~97% da base atual.  
- **React** – Biblioteca de UI base, utilizada via Next.js para criação de componentes e páginas.  
- **CSS / Tailwind / PostCSS** – Estilização com CSS e pipeline configurado via `postcss.config.mjs`, integrando utilitários e boas práticas de performance.  
- **Supabase** – Autenticação e backend-as-a-service para o fluxo do CMS (login, registro, dashboard e gestão de conteúdo).  
- **Node.js + npm / Yarn / pnpm / Bun** – Ambiente e gerenciadores de pacotes suportados para desenvolvimento e scripts (`npm run dev`, `yarn dev`, etc.).  
- **Vercel** – Plataforma de deploy e hosting do portal (`portalnexora.vercel.app`) com integração contínua a partir do GitHub.  
- **Biome** – Configuração de lint/format no `biome.json` para padronização de estilo e qualidade do código.  

Ferramentas de apoio e automação:

- `.github/` – Configurações de CI/CD, workflows e automações específicas do repositório.  
- `.claude/`, `.opencode/`, `.synapos/` – Diretórios de automação e agentes para colaboração assistida por IA, orquestração de tarefas e documentação viva dentro do repositório.  
- `AGENTS.md` – Aviso importante de que esta não é a versão “clássica” do Next.js; há breaking changes, convenções e estrutura diferentes e é obrigatório ler os guias em `node_modules/next/dist/docs/` antes de contribuir.  

---

## Tecnologias planejadas / futuras integrações

Com base nos diretórios de documentação (`tech-context`, `tech`, `business`, `specs`) e na presença de fluxo CMS + Supabase, alguns elementos se posicionam como evolução natural da stack:

- **Camadas adicionais de CMS headless** (ex.: evolução da modelagem de conteúdo, campos customizados e workflows editoriais).  
- **Ampliação de integrações com Supabase** (storage, row-level security, logs e analytics de eventos).  
- **Feature flags e AB testing** para experimentar novas seções do portal e validar hipóteses de UX.  
- **Monitoração e observabilidade** (logs estruturados, métricas de performance e erros) acoplados a dashboards internos.  
- **Internacionalização (i18n)** para tornar o portal acessível em múltiplos idiomas.  
- **Automação de documentação** conectando `docs/` com pipelines que gerem changelogs e releases automatizados.  

Esses itens podem ser refinados e consolidados a partir dos artefatos em `docs/business` e `docs/specs` à medida que o roadmap for evoluindo.

---

## Rotas importantes

A estrutura de rotas está centralizada em `src/app`, seguindo o padrão de pastas do App Router do Next.js.  
Abaixo estão as rotas principais previstas/implementadas com base nos commits e na documentação de eventos e CMS:

- `/` – Home do portal, com conteúdos institucionais, hero principal e destaques de eventos e programas.  
- `/eventos` – Listagem pública de eventos do Instituto Nexora, consumindo dados do CMS.  
- `/eventos/[slug]` – Página de detalhe de um evento específico (descrição, agenda, CTAs, inscrições, etc.).  
- `/cms/login` – Tela de login do CMS para equipe interna, integrada ao Supabase Auth.  
- `/cms/register` – Tela de registro para novos usuários autorizados a operar o CMS, conforme regras de governança do instituto.  
- `/cms/dashboard` – Dashboard autenticado para gestão de eventos, conteúdos e outras entidades administráveis.  

> Observação: a estrutura exata de pastas pode ser ajustada à medida que o App Router evolui, mas o fluxo “CMS + plataforma pública de eventos” já está implementado e consolidado nos últimos commits.

---

## Funcionalidades já implementadas

Com base nos commits recentes e na documentação em `docs/`, as seguintes funcionalidades estão implementadas ou em estágio avançado:

- **Fluxo completo de eventos**  
  - Criação e gestão de eventos via CMS.  
  - Exibição pública de eventos (listagem e detalhe) no portal.  
  - Integração entre camada de conteúdo e frontend com identidade visual atualizada.  

- **Autenticação do CMS com Supabase**  
  - Login e registro de usuários de CMS.  
  - Dashboard base para operações administrativas.  

- **Base de identidade visual e UI**  
  - Redesign da home e de eventos com identidade Deep Teal + Amber e componentes de UI reutilizáveis.  
  - Componentização da interface em `src/components` para garantir consistência visual.  

- **Documentação viva do produto**  
  - Especificações de MVP e documentação de produto em `docs/specs`.  
  - Changelog funcional em `docs/CHANGELOG.md` para acompanhar releases e incrementos.  
  - Protocolo CHANGE GUARD para rastrear modificações passo a passo e manter governança sobre o que entra em produção.  

---

## Funcionalidades pendentes / em desenvolvimento

A partir dos issues abertos, documentação de specs e presença de artefatos de pré-produção, algumas funcionalidades podem ser consideradas pendentes ou em desenvolvimento contínuo:

- **Aprimoramento do CMS**  
  - Novos tipos de conteúdo além de eventos (notícias, relatos, trilhas educacionais, etc.).  
  - Perfis de permissão mais granulares para diferentes papéis internos (comunicação, coordenação, curadoria de conteúdo).  

- **Melhorias de UX e acessibilidade**  
  - Refinos de navegação, breadcrumbs, estados de carregamento e mensagens de erro.  
  - Ajustes de acessibilidade (ARIA, contraste, navegação por teclado).  

- **Camada de observabilidade e métricas**  
  - Coleta e visualização de métricas de tráfego, engajamento em eventos e performance do portal.  

- **Evolução de pré-produção para produção completa**  
  - Validação de fluxos em ambiente pré-produção (`docs/pre-prd.md`) e ajustes necessários para hardening de produção.  

---

## Funcionalidades em stand by

Existem espaços claros na documentação que sinalizam capacidade futura ou backlog em espera, ainda não priorizados para este ciclo:

- **Módulos adicionais de portal** como blogs aprofundados, landing pages específicas para programas e integrações com plataformas externas (por exemplo, sistemas acadêmicos ou CRMs).  
- **Automação avançada com agentes** via `.claude/`, `.opencode/` e `.synapos`, ampliando o uso de IA para geração de conteúdo, QA automático e revisão de código.  
- **Internacionalização completa** e suporte a múltiplos domínios/brands debaixo do ecossistema Nexora.  

Esses itens permanecem em stand by até serem priorizados formalmente no roadmap em `docs/business` e `docs/specs`.

---

## Deploy

O Portal NEXORA é deployado na Vercel, com ambiente principal disponível em:  

- **Produção**: [`portalnexora.vercel.app`](https://portalnexora.vercel.app) – ambiente oficial público.  
- **Previews**: criados automaticamente a cada pull request, permitindo validação em ambiente espelhado antes do merge.  

A Vercel recebe builds diretamente do GitHub e utiliza a pipeline padrão do Next.js App Router para gerar as páginas e otimizações de performance.

---

## Contribuição

Antes de contribuir, é indispensável levar em conta que “This is NOT the Next.js you know”: esta versão possui breaking changes de APIs, convenções e estrutura de arquivos em relação à documentação clássica.  

Contribuidores devem seguir o protocolo CHANGE GUARD descrito em `docs/` para qualquer alteração relevante de fluxo, rota ou comportamento.

Para contribuir com este projeto, siga rigorosamente as diretrizes dos arquivos:

1. [PROJECT-INSTRUCTIONS.md](./PROJECT-INSTRUCTIONS.md)
2. [GOVERNANCE-GUIDE.md](./GOVERNANCE-GUIDE.md)

Esses documentos contêm todas as regras e processos obrigatórios para submissões.

Recomendações gerais:

- Abrir issue descrevendo claramente contexto, problema e proposta de solução.  
- Referenciar documentos em `docs/business`, `docs/specs` e `docs/tech-context` que embasem a mudança.  
- Atualizar `docs/CHANGELOG.md` e, quando necessário, registrar os passos no protocolo CHANGE GUARD.  

---

## Time e perfis de contribuição

O Portal NEXORA é desenvolvido pelo Instituto Nexora e conta com um time multidisciplinar, estruturado em squads.  
Abaixo, uma tabela com as pessoas que contribuem diretamente com o projeto:

### Tabela de contribuidores (GitHub)

| Foto                                                                 | Nome             | GitHub / Perfil                                                    | Papel principal           | Foco de contribuição                           | Status de contribuição |
|----------------------------------------------------------------------|------------------|---------------------------------------------------------------------|---------------------------|-----------------------------------------------|------------------------|
| <img src="https://github.com/viniciusgithub25.png" width="64" />     | Vinícius         | [@viniciusgithub25](https://github.com/viniciusgithub25)           | Engenheiro Frontend       | Implementação de rotas, componentes e UX      | Ativo                  |
| <img src="https://github.com/devjefferson.png" width="64" />         | Jefferson        | [@devjefferson](https://github.com/devjefferson)                   | Engenheiro Full-Stack       | Implementação de rotas, performance e UX      | Ativo                  |
| <img src="https://github.com/tenmenezes.png" width="64" />           | Yago Menezes     | [@tenmenezes](https://github.com/tenmenezes)                       | Engenheiro Full-Stack       | Visão de produto, Revisão geral, futuras implementações | Ativo                  |

### Tabela de squads e sessões (sincronizada com `docs/.squads/sessions/portal-nexora`)

Use esta tabela como visão macro das sessões/squads ligadas ao portal. A ideia é mantê-la alinhada com os arquivos em `docs/.squads/sessions/portal-nexora` e demais artefatos de squad.

| Squad / Sessão                        | Descrição breve                                         | Responsáveis principais                          | Artefatos relacionados                                       |
|--------------------------------------|---------------------------------------------------------|--------------------------------------------------|--------------------------------------------------------------|
| Portal Nexora – Frontend Web        | Desenvolvimento do portal público e camadas de UI       | Vinícius, Jefferson, Yago                        | `docs/tech`, `docs/specs`, `src/app`, `src/components`       |
| Portal Nexora – CMS & Conteúdo      | Fluxo de CMS, Supabase, modelos de conteúdo e governança| Yago, Jefferson            | `docs/business`, `docs/specs/cms-*`, `docs/tech-context`     |
| Portal Nexora – Observabilidade     | Métricas, logs, monitoração e qualidade em produção     | A definir                                       | `docs/tech-context`, `docs/pre-prd.md`, `docs/CHANGELOG.md`  |
| Portal Nexora – Experimentos & IA   | Automação com agentes, experimentos de UX, testes A/B   | A definir                                       | `.claude/`, `.opencode/`, `.synapos/`, `docs/_memory`        |

---

## Documentação complementar

Toda a documentação de negócio, técnica e de produto vive dentro do diretório `docs/` e deve ser tratada como parte essencial do código:

- `docs/index.md` – índice principal da documentação interna.  
- `docs/business/` – visão de negócio, objetivos estratégicos, público-alvo e contexto institucional.  
- `docs/specs/` – especificações funcionais e técnicas, incluindo fluxo de auth CMS.  
- `docs/tech-context/` – decisões arquiteturais, contexto de stack e trade-offs.  
- `docs/tech/` – documentação de implementação, padrões de código, guias para devs.  
- `docs/CHANGELOG.md` – registro cronológico de mudanças relevantes.  
- `docs/pre-prd.md` – checklist e informações sobre o ambiente de pré-produção.  

Ao abrir novas tarefas ou features, é recomendado sempre vincular o código a pelo menos um artefato em `docs/` para manter o alinhamento end-to-end entre visão, implementação e operação.
