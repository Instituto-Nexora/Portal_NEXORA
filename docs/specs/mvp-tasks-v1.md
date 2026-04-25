# Spec: MVP — Criar Tarefas no GitHub Projects

**Versão:** v1
**Data:** 2026-04-25
**Agent:** Priscila Produto
**Status:** approved

---

## Visão Geral

### Problema
O time de desenvolvimento precisa de tarefas rastreáveis no GitHub Projects para executar as 4 features do MVP de forma priorizada e organizada.

### Solução Proposta
Criar issues para cada feature do MVP, quebradas em sub-tarefas técnicas, no GitHub Projects do repositório.

### Persona Principal
Time de Desenvolvimento NEXORA — responsável pela implementação técnica.

### Métricas de Sucesso
| Métrica | Baseline | Target | Prazo |
|---|---|---|---|
| Tarefas criadas | 0 | ≥ 4 epics + 16 sub-tarefas | 2026-04-25 |
| Issues com labels | 0 | 100% categorizadas | 2026-04-25 |

---

## Escopo

### IN — O que está incluído nesta entrega
- 4 Epics (uma por feature MVP)
- Sub-tarefas técnicas para cada Epic
- Labels categorizadas por feature e prioridade

### OUT — O que está explicitamente fora
- Criação de issues em sistemas externos (Linear/Jira) — apenas GitHub
- Implementação de código das features
- Criação de milestones ou sprints

---

## Features do MVP

### 1. Landing Page + Checkout
**Epic:** Landing Page com Checkout integrado para curso piloto

**Sub-tarefas:**
- [ ] Criar página de vendas do curso piloto (`/vendas`)
- [ ] Criar página de checkout com botão de compra
- [ ] Integrar Stripe ou Mercado Pago (checkout)
- [ ] Exibir conteúdo programático do curso
- [ ] Exibir depoimentos de alunos
- [ ] Exibir seção de certificação
- [ ] Configurar webhook Stripe/MercadoPago para confirmação de pagamento
- [ ] Criar página de obrigado/confirmação pós-compra

### 2. Módulo de Cursos
**Epic:** Sistema de Gestão de Cursos

**Sub-tarefas:**
- [ ] Modelar schema de cursos no Supabase (cursos, aulas, progresso)
- [ ] Criar CRUD de cursos (Admin)
- [ ] Criar CRUD de aulas dentro de cursos (Admin)
- [ ] Criar player de vídeo para aulas (vídeo + material)
- [ ] Implementar controle de progresso do aluno por aula
- [ ] Implementar emissão de certificado (PDF)
- [ ] Criar página de listagem de cursos adquiridos (aluno)
- [ ] Criar página de detail do curso com aulas desbloqueadas

### 3. Autenticação
**Epic:** Sistema de Autenticação de Usuários

**Sub-tarefas:**
- [ ] Configurar Supabase Auth (e-mail/senha)
- [ ] Criar página de cadastro (/cadastro)
- [ ] Criar página de login (/login)
- [ ] Criar página de recuperação de senha
- [ ] Implementar logout
- [ ] Implementar proteção de rotas autenticadas
- [ ] Criar página de perfil do aluno
- [ ] Vincular purchases do usuário ao account

### 4. Eventos (Fase 1 Simplificada)
**Epic:** Sistema de Inscrição em Eventos

**Sub-tarefas:**
- [ ] Criar página de listagem de eventos (/eventos)
- [ ] Criar página de detail do evento (/eventos/[slug])
- [ ] Criar formulário de inscrição (com e sem pagamento)
- [ ] Integrar pagamento Stripe/Mercado Pago para eventos pagos
- [ ] Criar fluxo de confirmação de inscrição por e-mail
- [ ] Criar área do aluno com eventos inscritos
- [ ] Criar página "Meus Eventos"

---

## Requisitos Funcionais

| ID | Descrição | Critério de Aceite | Prioridade |
|---|---|---|---|
| RF-01 | Criar Epic para Landing Page | Epic com ≥ 8 sub-tarefas no Projects | P0 |
| RF-02 | Criar Epic para Módulo de Cursos | Epic com ≥ 8 sub-tarefas no Projects | P0 |
| RF-03 | Criar Epic para Autenticação | Epic com ≥ 8 sub-tarefas no Projects | P0 |
| RF-04 | Criar Epic para Eventos | Epic com ≥ 7 sub-tarefas no Projects | P0 |
| RF-05 | Categorizar tasks com labels | Cada task com label de feature + prioridade | P0 |

---

## Requisitos Não-Funcionais

| ID | Categoria | Requisito | Valor |
|---|---|---|---|
| RNF-01 | Formato | Tasks no formato Markdown para importação | GitHub Projects |
| RNF-02 | Priorização | Tasks priorizadas P0/P1/P2 | Conforme spec |

---

## Dependências

| Dependência | Tipo | Status |
|---|---|---|
| Repositório GitHub configurado com Projects | técnica | existente |
| Labels do Projects configuradas | técnica | a desenvolver |

---

## Perguntas em Aberto

| # | Pergunta | Responsável | Prazo |
|---|---|---|---|
| 1 | Qual repositório GitHub? | Jefferson | 2026-04-25 |
| 2 | Projects Number? | Jefferson | 2026-04-25 | → projects/1 (Instituto-Nexora) |

---

## Referências

- Catálogo de features: `docs/business/features/catalog.md`
- Contexto de negócio: `docs/business/business-context.md`
- Visão de produto: `docs/business/product-vision.md`
