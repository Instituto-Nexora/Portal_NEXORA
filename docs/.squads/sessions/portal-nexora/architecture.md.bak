# Decisão Arquitetural: Criar Novos Administradores (CMS)

**Data:** 2026-04-30
**Agent:** Ana Arquitetura (ana-arquitetura-fe)
**Status:** Aprovado para implementação

---

## Entendimento da Task

Formulário dentro do dashboard CMS que permite a um admin autenticado criar uma nova conta de usuário administrativo — escolhendo nome, e-mail, senha temporária e role (admin, content_creator, professor). Diferente de `/cms/register` (auto-cadastro de acesso livre), este fluxo é **protegido** e usa a Supabase Admin API (`auth.admin.createUser`) via service role key.

---

## Contexto Existente

O CMS já possui:
- `/cms/login` e `/cms/register` — auto-cadastro público
- `/cms/dashboard` — painel protegido por `proxy.ts` + `dashboard/layout.tsx`
- Tabela `admin_profiles` com campo `role: 'admin' | 'content_creator' | 'professor'`
- `CMSShell` com Sidebar e TopBar

A nova feature se encaixa dentro do dashboard existente, sem tocar nas rotas de auth.

---

## Estrutura de Componentes

```
src/app/(cms)/cms/dashboard/
└── admins/
    └── novo/
        ├── page.tsx
        └── _features/
            └── NovoAdmin/
                ├── view.tsx
                ├── viewModel.tsx
                ├── schema.ts
                └── actions.ts
```

> `_features/` com `_` prefix é invisível ao App Router — não gera rota.
> Padrão conforme [DECISÃO CRÍTICA] em memories.md de 2026-04-25.

---

## Decisões de Estado

| Estado | Tipo | Justificativa |
|---|---|---|
| Dados do formulário | React Hook Form | Obrigatório por ADR-004; sem useState por campo |
| Erros de validação client | RHF + Zod resolver | Validação em tempo real no cliente |
| Erros de servidor / feedback | `useActionState` | Padrão App Router; mantém estado do Server Action |
| Loading do submit | `isPending` do `useActionState` | Nativo, sem estado extra |
| Role selecionado | RHF field `role` | Campo controlado pelo form, sem estado separado |

---

## Contratos dos Componentes

```typescript
// schema.ts
import { z } from 'zod'

export const novoAdminSchema = z
  .object({
    full_name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
    confirm_password: z.string(),
    role: z.enum(['admin', 'content_creator', 'professor'], {
      error: 'Role inválido',
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'As senhas não coincidem',
    path: ['confirm_password'],
  })

export type NovoAdminFormData = z.infer<typeof novoAdminSchema>
```

```typescript
// viewModel.tsx — contrato de retorno
type NovoAdminViewModel = {
  form: UseFormReturn<NovoAdminFormData>
  formAction: (payload: FormData) => void
  isPending: boolean
  state: ActionState
}
```

```typescript
// actions.ts — assinatura do Server Action
async function criarAdmin(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState>
```

---

## ADR-FE-001 — Admin API vs signUp para criação interna de contas

**Contexto:** `supabase.auth.signUp()` envia e-mail de confirmação e não permite definir role no momento da criação. O dashboard precisa criar contas sem confirmação e com role explícito.

**Decisão:** Usar `supabase.auth.admin.createUser()` no Server Action, com `email_confirm: true`. Inserir profile em `admin_profiles` com o role escolhido em seguida.

**Alternativas rejeitadas:**
- `signUp()` — envia e-mail de confirmação, sem controle de role imediato

**Consequências:**
- ✅ Conta ativa imediatamente, sem e-mail pendente
- ✅ Role definido no momento da criação
- ✅ Service role key fica 100% server-side
- ⚠ Requer `SUPABASE_SERVICE_ROLE_KEY` em `.env.local` — nunca expor ao cliente
- ⚠ Criar `createAdminClient()` separado em `src/lib/supabase/admin.ts`

---

## ADR-FE-002 — Separação View / ViewModel (ADR-004 aplicado)

**Contexto:** Features CMS existentes (`/cms/register`, `/cms/login`) têm lógica misturada em `view.tsx`, sem `viewModel.tsx`. A nova feature deve seguir ADR-004 corretamente.

**Decisão:** Criar `viewModel.tsx` separado. Não refatorar os existentes (fora do escopo).

**Consequências:**
- ✅ `view.tsx` contém apenas JSX + Shadcn
- ✅ `viewModel.tsx` encapsula `useActionState`, `useForm`, handlers
- ✅ Serve de referência para refatoração futura dos existentes
- ⚠ Inconsistência momentânea com features antigas — intencional

---

## Pontos de Atenção para o Dev

1. **`createAdminClient()`** — usa `SUPABASE_SERVICE_ROLE_KEY`, sem cookie handling. Criar em `src/lib/supabase/admin.ts`, diferente de `createClient()`.

2. **Campo `role` com Shadcn `<Select>`** — não é input nativo; usar `Controller` do RHF, não `register`.

3. **`cn()` obrigatório em todo `className`** — ADR-007, sem exceção.

4. **`type` em vez de `interface`** — ADR-005. `NovoAdminFormData` derivado via `z.infer<>`.

5. **Comportamento pós-sucesso** — redirecionar para `/cms/dashboard` após criação (listagem de admins fora do escopo desta task). O Server Action chama `redirect('/cms/dashboard')`.

6. **Zod v4** — mensagens de erro como segundo arg string, não objeto `{ message }`. Confirmar versão instalada.

---

## Arquivos a Criar/Modificar

### Criar

| Arquivo | Descrição |
|---|---|
| `src/app/(cms)/cms/dashboard/admins/novo/page.tsx` | Server Component — ponto de entrada |
| `src/app/(cms)/cms/dashboard/admins/novo/_features/NovoAdmin/schema.ts` | Zod schema |
| `src/app/(cms)/cms/dashboard/admins/novo/_features/NovoAdmin/viewModel.tsx` | Lógica + form |
| `src/app/(cms)/cms/dashboard/admins/novo/_features/NovoAdmin/view.tsx` | UI pura |
| `src/app/(cms)/cms/dashboard/admins/novo/_features/NovoAdmin/actions.ts` | Server Action |
| `src/lib/supabase/admin.ts` | `createAdminClient()` com service role key |

### Não modificar

| Arquivo | Motivo |
|---|---|
| `src/app/(cms)/cms/register/*` | Auto-cadastro existente — fora do escopo |
| `src/app/(cms)/cms/dashboard/layout.tsx` | Proteção já existente |
| `src/proxy.ts` ou `src/middleware.ts` | Já cobre `/cms/dashboard/*` |
| Tabela `admin_profiles` | Estrutura existente é suficiente |
