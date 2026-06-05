# Memória: gerenciamento-de-ticket

> Aprendizados acumulados e contexto da Epic #93 (Sistema de Tickets / Contato).

<!-- RECENTES -->
## [Contexto Base] — Planejamento da Feature
- **Escopo:** Sistema completo de tickets de suporte: abertura pelo aluno, acompanhamento via chat e gestão completa pelo CMS (Admin).
- **Tarefas Mapeadas:**
  - #94: Modelagem de Banco de Dados (tabelas `tickets`, `ticket_messages` e RLS).
  - #95: Aluno — Listagem de tickets (`/minha-area/tickets`).
  - #96: Aluno — Abertura de ticket com tópicos (`/minha-area/tickets/novo`).
  - #97: Aluno — Chat do ticket (`/minha-area/tickets/[id]`).
  - #98: Aluno — Badge de respostas não lidas no sidebar.
  - #99: CMS Admin — Listagem geral e filtros (`/cms/dashboard/tickets`).
  - #100: CMS Admin — Detalhe do ticket, gestão de status e chat.
- **Arquitetura (ADR-004):** Todas as telas devem seguir o padrão MVVM, Server Actions nativas (React 19), validação com Zod + React Hook Form. Componentes de UI usam Shadcn/Tailwind v4.
<!-- /RECENTES -->
