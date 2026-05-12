# NEXORA — Especificação de APIs

> Estado em 2026-04-25. Nenhuma API implementada ainda. Este documento registra o contrato planejado.

---

## Convenção

- Base path: `/api/`
- Formato: JSON
- Autenticação: Bearer token (Supabase JWT) no header `Authorization`
- Erros seguem o formato: `{ "error": "mensagem" }`

---

## Endpoints Planejados

### Auth
Gerenciado pelo Supabase Auth SDK diretamente no cliente — sem rotas customizadas necessárias para login/signup.

---

### Courses

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/api/courses` | Listar cursos publicados | Não |
| GET | `/api/courses/[id]` | Detalhe do curso | Não |
| POST | `/api/courses` | Criar curso (admin) | Sim (admin) |

---

### Enrollments

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/api/enrollments` | Cursos do usuário logado | Sim |
| GET | `/api/enrollments/[courseId]/progress` | Progresso no curso | Sim |
| PATCH | `/api/enrollments/[courseId]/progress` | Atualizar progresso | Sim |

---

### Events

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/api/events` | Listar eventos futuros | Não |
| GET | `/api/events/[id]` | Detalhe do evento | Não |

---

### Checkout

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/api/checkout/course` | Criar Stripe Checkout Session para curso | Sim |
| POST | `/api/checkout/event` | Criar Stripe Checkout Session para evento | Sim |

---

### Webhooks

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/api/webhooks/stripe` | Receber eventos do Stripe | Stripe signature |

---

### Certificates

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/api/certificates/[enrollmentId]` | Gerar/obter certificado | Sim |

---

## ⚠️ A INVESTIGAR

- Endpoints para área administrativa (dashboard de vendas, gestão de cursos)
- Integração com sistema de email (confirmação de compra, boas-vindas)
- Rate limiting nas rotas públicas
