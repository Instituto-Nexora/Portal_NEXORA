# Spec: Roadmap Consolidado — NEXORA-TI (Expansão + MVP)

**Versão:** v4
**Data:** 2026-05-12
**Status:** draft
**Master Issue:** #107-#111 (Centralizadora)

---

## Visão Geral
Este documento detalha as novas funcionalidades para a evolução do **NEXORA-TI**, estabelecendo a ponte entre a especificação técnica e o tracking de Epics no GitHub Projects.

---

## Epics e Sub-tarefas

### 1. Gestão Acadêmica Avançada
**Epic:** Sistema de Cursos, Turmas e Controle de Alunos (#107)

- [ ] **CRUD de Cursos (Admin):** Interface para criar e gerenciar a base de cursos. (#19, #86)
- [ ] **CRUD de Aulas (Admin):** Gestão de módulos, vídeos e materiais dentro dos cursos. (#20)
- [ ] **Player de Vídeo:** Implementar player customizado com suporte a materiais. (#21)
- [ ] **Controle de Progresso:** Rastrear evolução do aluno aula a aula. (#22)
- [ ] **Geração de Turmas:** Implementar funcionalidade para "Gerar Turma" a partir de um curso existente.
- [ ] **Gestão de Chamada:** Criar sistema de registro de presença (chamada) por aula/encontro.
- [ ] **Status do Aluno:** Implementar lógica de aprovação/reprovação baseada em frequência e/ou nota.
- [ ] **Emissão de Certificado:** Desenvolver gerador de certificados em PDF. (#23)

### 2. Fluxo de Inscrição e Pagamento
**Epic:** Checkout e Matrícula (#108)

- [ ] **Página de Vendas:** Criar Landing Page do curso piloto. (#10, #13, #14)
- [ ] **Checkout e Pagamento:** Criar UI de checkout e integrar Stripe/Mercado Pago. (#11, #12, #16)
- [ ] **Confirmação de Compra:** Página de obrigado e vinculação de compra ao perfil. (#17, #33)
- [ ] **Minha Área (Aluno):** Listagem de cursos e detalhes das aulas desbloqueadas. (#24, #25)
- [ ] **Perfil do Usuário:** Rota de perfil e alteração de foto. (#70, #68)

### 3. Evolução do Módulo de Eventos
**Epic:** Organização Cronológica de Eventos (#109)

- [ ] **Refatoração da Query de Eventos:** Ajustar a busca no Supabase para ordenar eventos por ano (descendente) e data (mais recente para o mais antigo).
- [ ] **Interface de Timeline:** Agrupar visualmente os eventos por ano na página `/eventos`.
- [ ] **PWA Support:** Adição de suporte a PWA para acessibilidade e uso offline básico. (#72)

### 4. Business Factory (Nova Vertical)
**Epic:** Lançamento da Vertical Business Factory (#110)

- [ ] **Gestão de Contatos:** Criar módulo para gerenciar mensagens recebidas via landing page. (#88)
- [ ] **Briefing Business Factory:** Documento de visão/especificação para a vertical (Pendente).
- [ ] **Página Institucional:** Criar a landing page `/business-factory` com a proposta de valor da fábrica de negócios.
- [ ] **Formulário de Contato/Briefing:** Criar área para empresas interessadas submeterem propostas.

### 5. Admin (CMS), Segurança e Core
**Epic:** Governança e Infraestrutura Administrativa (#111)

- [ ] **Segurança de Domínio:** Finalizar isolamento do domínio administrativo. (#91)
- [ ] **RBAC (Roles):** Separar permissões (Admin, Content Creator, Professor). (#90)
- [ ] **Auditoria de Ações:** Implementar logs de quem alterou o quê no CMS. (#89)
- [ ] **Dashboard de Métricas:** Expandir dashboard com dados reais de vendas e alunos. (#87, #59)
- [ ] **Padronização de Navegação:** Refatorar rotas e mapa da sidebar. (#85)
- [ ] **Autenticação:** Recuperação de senha e novos provedores sociais. (#29, #71)

---

## Requisitos Técnicos

| ID | Requisito | Detalhe |
|---|---|---|
| RT-01 | Ordenação de Eventos | `order('date', { ascending: false })` no Supabase. |
| RT-02 | PDF Generator | Utilizar biblioteca `react-pdf` ou similar para certificados. |
| RT-03 | Schema Update | Adicionar tabelas `cohorts` (turmas), `attendance` (chamadas) e `enrollments` ao DB. |
| RT-04 | Audit Logs | Criar trigger no PostgreSQL para popular tabela `audit_logs`. |
| RT-05 | RBAC | Implementar controle de acesso baseado em roles (`admin`, `professor`, `content_creator`). |

---

## Mudanças de Nomenclatura
- O projeto passa a ser referenciado oficialmente como **NEXORA-TI**.

---
📋 [CHANGE GUARD] - ROADMAP V4 (ISSUE MASTER CONFIGURADA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✏️  ALTERADOS (1 arquivo(s))
  c:\Users\caioq\Documents\clone\Portal_NEXORA\docs\specs\expansion-tasks-v1.md

👁️  REVISADOS · SEM ALTERAÇÃO (0 arquivo(s))

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
0 criado(s) · 1 alterado(s) · 0 sem alteração necessária
---