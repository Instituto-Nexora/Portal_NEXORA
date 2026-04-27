# NEXORA — Regras de Negócio e Domínio

> Estado em 2026-04-25. Lógica de domínio ainda não implementada no codebase.

---

## Entidades de Domínio (planejadas)

### User
- Pode ser aluno (B2C) ou representante de empresa (B2B)
- Acessa apenas conteúdo que comprou
- Tem progresso rastreado por curso

### Course
- Tem preço, descrição, conteúdo programático
- Composto por `Lessons` (aulas)
- Emite certificado ao concluir
- Pode ter status: `draft`, `published`, `archived`

### Lesson
- Pertence a um `Course`
- Tem tipo: vídeo, material PDF, exercício
- Progresso rastreado por usuário

### Enrollment
- Relação entre `User` e `Course`
- Criada após pagamento confirmado (webhook Stripe)
- Contém progresso (% concluído)

### Event
- Palestra, workshop ou bootcamp
- Tem data, formato (online/presencial), preço
- Inscrição via checkout

### Order
- Registro de compra (curso ou evento)
- Status: `pending`, `paid`, `refunded`
- Vinculada ao Stripe payment intent

---

## Regras de Acesso

| Ação | Regra |
|---|---|
| Assistir aula | Requer `Enrollment` ativa no curso |
| Emitir certificado | Requer 100% de progresso no curso |
| Inscrever em evento | Requer `Order` com status `paid` |
| Ver conteúdo de preview | Liberado sem autenticação |

---

## Fluxo de Compra

```
1. Usuário acessa página do curso
2. Clica em "Comprar"
3. Redireciona para checkout Stripe
4. Stripe processa pagamento
5. Webhook Stripe notifica Next.js (/api/webhooks/stripe)
6. Endpoint cria Order (paid) + Enrollment no Supabase
7. Usuário recebe email de confirmação + acesso liberado
```

---

## Controle de Acesso (a implementar com Supabase RLS)

- Usuário só acessa suas próprias `Enrollments`
- Aulas só servem conteúdo se `Enrollment` existir
- Admin pode ver todos os dados

---

## ⚠️ A INVESTIGAR

- Política de reembolso (prazo e condições)
- Regras de expiração de acesso (acesso vitalício ou por período?)
- Lógica de desconto / cupons
- Regras específicas para treinamentos corporativos (multi-seat?)
