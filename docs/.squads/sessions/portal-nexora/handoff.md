# Handoff: MVP — Criar Tarefas no GitHub Projects

**Data:** 2026-04-25 | **Squad:** produto-001
**Spec:** [mvp-tasks-v1.md](../specs/mvp-tasks-v1.md)

---

## Resumo

4 Epics para criar no **Projects: Instituto-Nexora/projects/1**

---

## Epic 1 — Landing Page + Checkout

```
## Landing Page com Checkout integrado para curso piloto

### Descrição
Página de vendas do curso piloto com checkout integrado para pagamento (Stripe/Mercado Pago), conteúdo programático, depoimentos e seção de certificação.

### Tasks
- [ ] Criar página de vendas do curso piloto (/vendas)
- [ ] Criar página de checkout com botão de compra
- [ ] Integrar Stripe ou Mercado Pago (checkout)
- [ ] Exibir conteúdo programático do curso
- [ ] Exibir depoimentos de alunos
- [ ] Exibir seção de certificação
- [ ] Configurar webhook Stripe/MercadoPago para confirmação de pagamento
- [ ] Criar página de obrigado/confirmação pós-compra

### Labels
- feature: landing-page
- priority: P0
```

---

## Epic 2 — Módulo de Cursos

```
## Sistema de Gestão de Cursos

### Descrição
CRUD completo de cursos com player de vídeo, controle de progresso por aluno e emissão de certificado PDF.

### Tasks
- [ ] Modelar schema de cursos no Supabase (cursos, aulas, progresso)
- [ ] Criar CRUD de cursos (Admin)
- [ ] Criar CRUD de aulas dentro de cursos (Admin)
- [ ] Criar player de vídeo para aulas (vídeo + material)
- [ ] Implementar controle de progresso do aluno por aula
- [ ] Implementar emissão de certificado (PDF)
- [ ] Criar página de listagem de cursos adquiridos (aluno)
- [ ] Criar página de detail do curso com aulas desbloqueadas

### Labels
- feature: modulo-cursos
- priority: P0
```

---

## Epic 3 — Autenticação

```
## Sistema de Autenticação de Usuários

### Descrição
Cadastro, login e recuperação de senha via Supabase Auth. Proteção de rotas autenticadas e vínculo de compras ao account.

### Tasks
- [ ] Configurar Supabase Auth (e-mail/senha)
- [ ] Criar página de cadastro (/cadastro)
- [ ] Criar página de login (/login)
- [ ] Criar página de recuperação de senha
- [ ] Implementar logout
- [ ] Implementar proteção de rotas autenticadas
- [ ] Criar página de perfil do aluno
- [ ] Vincular purchases do usuário ao account

### Labels
- feature: autenticacao
- priority: P0
```

---

## Epic 4 — Eventos (Fase 1 Simplificada)

```
## Sistema de Inscrição em Eventos

### Descrição
Inscrição em workshops/palestras com integração de pagamento opcional e confirmação por e-mail.

### Tasks
- [ ] Criar página de listagem de eventos (/eventos)
- [ ] Criar página de detail do evento (/eventos/[slug])
- [ ] Criar formulário de inscrição (com e sem pagamento)
- [ ] Integrar pagamento Stripe/Mercado Pago para eventos pagos
- [ ] Criar fluxo de confirmação de inscrição por e-mail
- [ ] Criar área do aluno com eventos inscritos
- [ ] Criar página "Meus Eventos"

### Labels
- feature: eventos
- priority: P0
```

---

## Checklist de Handoff

☐ Problema resolvido está claro? ✅
☐ Usuários afetados identificados? ✅ (Time de Desenvolvimento)
☐ Critérios de aceite documentados? ✅ (spec mvp-tasks-v1.md)
☐ Dependências técnicas listadas? ✅ (Supabase, Stripe/MercadoPago)
☐ O que está fora do escopo está explícito? ✅
☐ Decisões tomadas têm raciocínio documentado? ✅
☐ Perguntas em aberto têm responsável e prazo? ✅

---

## Perguntas em Aberto (agora respondidas)

| # | Pergunta | Resposta |
|---|---|---|
| 1 | Qual repositório GitHub? | Instituto-Nexora/Portal_NEXORA |
| 2 | Projects Number? | projects/1 |

---

## Ação Requerida do Dev

1. Aceder https://github.com/orgs/Instituto-Nexora/projects/1
2. Criar 4 Issues (Epics) conforme above
3. Adicionar sub-tasks a cada Epic
4. Aplicar labels correspondentes
