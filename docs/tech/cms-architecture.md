# CMS — Arquitetura do Fluxo de Autenticação e Painel Administrativo

> Produzido por Ana Arquitetura (ana-arquitetura-fe) — Squad frontend-001  
> Data: 2026-04-30 | Status: Aprovado para implementação

---

## 1. Entendimento da Task

O objetivo é criar o fluxo completo de acesso ao CMS do Portal Nexora: autenticação via Supabase Auth (login/logout/cadastro), proteção de rotas, sidebar/navbar do painel e schema do banco para múltiplos perfis de acesso (admin, content_creator, professor). O CMS roda sob o route group `(cms)` e deve ser completamente isolado do site público.

---

## 2. Estrutura de Arquivos e Pastas

```
src/
├── app/
│   ├── (publics)/                         # site público (existente)
│   ├── (cms)/                             # route group CMS — não gera segmento de URL
│   │   ├── layout.tsx                     # CMS layout — valida sessão, renderiza Sidebar
│   │   ├── login/
│   │   │   ├── page.tsx                   # Server Component — sem lógica, sem hooks
│   │   │   └── _features/login/
│   │   │       ├── schema.ts              # Zod schema do formulário de login
│   │   │       ├── view.tsx               # Client Component — formulário RHF
│   │   │       └── actions.ts             # Server Actions — signIn, signOut
│   │   ├── register/
│   │   │   ├── page.tsx
│   │   │   └── _features/register/
│   │   │       ├── schema.ts
│   │   │       ├── view.tsx
│   │   │       └── actions.ts
│   │   └── dashboard/
│   │       ├── page.tsx                   # Dashboard principal (Server Component)
│   │       └── _features/dashboard/
│   │           └── view.tsx               # Conteúdo do dashboard
│   ├── globals.css
│   ├── favicon.ico
│   └── layout.tsx                         # Root layout (existente)
│
├── components/
│   ├── cms/                               # Componentes exclusivos do CMS
│   │   ├── Sidebar/
│   │   │   ├── index.tsx                  # Server Component — lê sessão e renderiza
│   │   │   ├── SidebarNav.tsx             # Client Component — links ativos com usePathname
│   │   │   └── SidebarUserMenu.tsx        # Client Component — avatar + logout
│   │   ├── TopBar/
│   │   │   └── index.tsx                  # Client Component — título da página + ações
│   │   └── CMSShell.tsx                   # Layout shell: Sidebar + área de conteúdo
│   ├── layout/                            # Header/Footer públicos (existente)
│   └── ui/                               # Shadcn (existente)
│
├── lib/
│   ├── utils.ts                           # cn() (existente)
│   └── supabase/
│       ├── client.ts                      # createBrowserClient — uso em Client Components
│       ├── server.ts                      # createServerClient — uso em Server Components e Actions
│       └── middleware.ts                  # createServerClient para uso no proxy
│
└── middleware.ts                          # Proxy Next.js — proteção de rotas CMS
```

> **Nota de rota:** O route group `(cms)` isola o CMS sem prefixar URLs. As rotas resultantes são `/login`, `/register` e `/dashboard`. Se houver conflito com rotas públicas que usem os mesmos slugs, o route group deverá ser renomeado para `(cms-area)` e as rotas prefixadas: `/cms/login`, `/cms/dashboard`.
>
> **Decisão adotada aqui:** Usar prefixo `/cms/*` via route group `(cms)` + pasta `cms/` dentro de `(cms)`. Rotas resultantes: `/cms/login`, `/cms/register`, `/cms/dashboard`.  
> Estrutura revisada:

```
src/app/
└── (cms)/
    └── cms/                               # gera o prefixo /cms na URL
        ├── login/page.tsx                 → /cms/login
        ├── register/page.tsx              → /cms/register
        └── dashboard/page.tsx             → /cms/dashboard
```

---

## 3. Decisões de Estado

| Contexto | Decisão | Justificativa |
|---|---|---|
| Dados da sessão autenticada | Lidos via `createServerClient` no Server Component/layout | Sem estado global no cliente — evita prop drilling e hydration mismatch |
| Formulários de login/cadastro | `useActionState` + Server Actions | Padrão Next.js 16 App Router; sem fetch manual; sem `useState` para campos |
| Rota ativa na Sidebar | `usePathname()` no `SidebarNav` (Client Component) | API de navegação só disponível no cliente |
| Logout | Server Action com `supabase.auth.signOut()` + `redirect()` | Garante limpeza de cookies pelo servidor |
| Dados do usuário logado para Sidebar | Passados como props do Server Component pai | Evita criar Context desnecessário; o volume de dados é mínimo (nome, role, avatar) |

---

## 4. Contratos dos Componentes Principais

```typescript
// src/lib/supabase/types.ts

type AdminRole = 'admin' | 'content_creator' | 'professor'

type AdminProfile = {
  id: string
  user_id: string
  full_name: string
  role: AdminRole
  avatar_url: string | null
  created_at: string
}

type SessionUser = {
  id: string
  email: string
  profile: AdminProfile
}
```

```typescript
// src/components/cms/Sidebar/index.tsx
type SidebarProps = {
  user: SessionUser
}

// src/components/cms/Sidebar/SidebarNav.tsx
type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

type SidebarNavProps = {
  items: NavItem[]
}

// src/components/cms/Sidebar/SidebarUserMenu.tsx
type SidebarUserMenuProps = {
  user: SessionUser
}

// src/components/cms/CMSShell.tsx
type CMSShellProps = {
  user: SessionUser
  children: React.ReactNode
}
```

```typescript
// src/app/(cms)/cms/login/_features/login/schema.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email({ error: 'Email inválido' }),
  password: z.string().min(8, { error: 'Mínimo 8 caracteres' }),
})

export type LoginFormData = z.infer<typeof loginSchema>
```

```typescript
// src/app/(cms)/cms/register/_features/register/schema.ts
import { z } from 'zod'

export const registerSchema = z.object({
  full_name: z.string().min(2, { error: 'Nome obrigatório' }),
  email: z.email({ error: 'Email inválido' }),
  password: z.string().min(8, { error: 'Mínimo 8 caracteres' }),
  role: z.enum(['admin', 'content_creator', 'professor']),
})

export type RegisterFormData = z.infer<typeof registerSchema>
```

```typescript
// Tipo do estado de Server Actions (useActionState)
type ActionState = {
  errors?: Record<string, string[]>
  message?: string
} | undefined
```

---

## 5. Schema Supabase

### SQL — tabela `profiles`

```sql
-- Executar no SQL Editor do Supabase
-- Depende da tabela auth.users gerenciada pelo Supabase Auth

create type public.admin_role as enum (
  'admin',
  'content_creator',
  'professor'
);

create table public.profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  full_name   text not null,
  role        public.admin_role not null default 'content_creator',
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint profiles_user_id_unique unique (user_id)
);

-- RLS obrigatório
alter table public.profiles enable row level security;

-- Admins veem todos os profiles
create policy "admins_read_all_profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.user_id = auth.uid()
        and p.role = 'admin'
    )
  );

-- Usuário lê seu próprio profile
create policy "user_read_own_profile"
  on public.profiles for select
  using (user_id = auth.uid());

-- Apenas admins criam profiles de outros usuários via service role
-- Inserção via service role no Server Action de registro (sem RLS bypass no cliente)

-- Trigger para atualizar updated_at
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();
```

### Variáveis de Ambiente necessárias

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...          # cliente browser
SUPABASE_SERVICE_ROLE_KEY=eyJ...              # NUNCA expor ao cliente
```

---

## 6. ADRs

### ADR-008 — Estratégia de Auth: Supabase SSR via `@supabase/ssr`

**Data:** 2026-04-30 | **Status:** Aceita

**Contexto:** O Supabase Auth pode ser usado de três formas: (a) client-only com `@supabase/supabase-js` + `localStorage`; (b) `@supabase/auth-helpers-nextjs` (depreciado); (c) `@supabase/ssr` com cookies.

**Decisão:** Usar `@supabase/ssr` com dois clients distintos:
- `createBrowserClient` → Client Components (leitura de sessão no cliente)
- `createServerClient` → Server Components, Server Actions e Proxy (leitura e escrita de cookies)

**Trade-offs:**
- ✅ Sessão disponível no servidor antes do render — sem flicker de autenticação
- ✅ Cookies HttpOnly gerenciados pelo Supabase — sem exposição de tokens no `localStorage`
- ✅ Compatível com Next.js App Router e Proxy (Node.js runtime)
- ❌ Requer dois clients distintos — mais boilerplate
- ❌ `@supabase/ssr` é o pacote correto; `@supabase/auth-helpers-nextjs` está depreciado e NÃO deve ser usado

**Dependências a instalar:**
```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

### ADR-009 — Estrutura do Route Group CMS

**Data:** 2026-04-30 | **Status:** Aceita

**Contexto:** O CMS precisa de layout próprio (com Sidebar) sem contaminar o layout do site público.

**Decisão:** Route group `(cms)` com pasta `cms/` interna, gerando rotas `/cms/*`. O layout `(cms)/layout.tsx` envolve apenas as rotas do CMS.

**Trade-offs:**
- ✅ Isolamento total de layout entre site público e CMS
- ✅ Prefixo `/cms` semânticamente claro nas URLs
- ✅ `page.tsx` dentro de `(cms)/cms/login/` → rota `/cms/login` sem segmento extra do route group
- ❌ Nesting duplo `(cms)/cms/` é contra-intuitivo — documentar para o time

**Alternativa rejeitada:** Route group `(cms)` diretamente com `login/page.tsx` → rota `/login` colide com possível página de login futuro do site público.

---

### ADR-010 — Proteção de Rotas: Proxy (middleware.ts) como camada primária

**Data:** 2026-04-30 | **Status:** Aceita

**Contexto:** Duas opções para proteger `/cms/*`:  
(a) Verificar sessão no `layout.tsx` do CMS  
(b) Usar o Proxy (`middleware.ts`) para redirecionar antes do render

**Decisão:** Proxy (`src/middleware.ts`) como camada primária + verificação no layout como camada secundária.

O Proxy faz verificação otimista lendo o cookie de sessão do Supabase (sem query ao banco). O layout faz verificação definitiva chamando `supabase.auth.getUser()`.

```
Request → Proxy (cookie check) → Layout (getUser()) → Page
```

**Trade-offs:**
- ✅ Proxy evita render de páginas protegidas para usuários não autenticados
- ✅ Layout como segunda linha de defesa — não depende apenas do cookie
- ✅ Proxy não bloqueia rotas públicas (`/`, `/eventos`, etc.)
- ❌ Lógica de auth em dois lugares — manter sincronizado
- ❌ Proxy roda em todo request — manter lógica mínima (só leitura de cookie, sem DB)

**Alternativa rejeitada:** Layout-only check — renderiza a página no servidor antes de redirecionar, causando flash e potencial leak de dados.

---

### ADR-011 — Formulários CMS: React Hook Form + Zod + useActionState

**Data:** 2026-04-30 | **Status:** Aceita

**Contexto:** Formulários de login e cadastro precisam de validação client-side e server-side. Zod e RHF não estão instalados no projeto.

**Decisão:** Instalar Zod e React Hook Form. Usar o padrão:
- Schema Zod em `schema.ts` — fonte única de validação
- RHF com `resolver` Zod para validação client-side em tempo real
- `useActionState` para receber erros do Server Action
- Server Action valida com o mesmo schema Zod antes de chamar Supabase

**Dependências a instalar:**
```bash
npm install zod react-hook-form @hookform/resolvers
```

**Trade-offs:**
- ✅ Validação consistente client e server com o mesmo schema
- ✅ Sem `useState` para campos — conforme regra crítica do projeto
- ✅ `type LoginFormData = z.infer<typeof loginSchema>` — sem duplicação de tipos
- ❌ Mais dependências no projeto
- ❌ RHF é Client Component — `view.tsx` precisa de `"use client"`

---

## 7. Pontos de Atenção para o Dev

1. **`@supabase/auth-helpers-nextjs` está depreciado** — usar exclusivamente `@supabase/ssr`. Qualquer exemplo da internet que use `createClientComponentClient` ou `createServerComponentClient` está desatualizado.

2. **Proxy vs Middleware nomenclatura:** No Next.js 16, o arquivo é `middleware.ts` mas a doc interna chama de "Proxy". O arquivo fica na raiz do projeto (`src/middleware.ts`), não dentro de `app/`.

3. **`cookies()` é assíncrono no Next.js 16** — sempre `await cookies()`, não `cookies()` síncrono.

4. **`createServerClient` precisa de handler de cookies** — o server client do `@supabase/ssr` requer que você passe `get`/`set`/`remove` de cookies manualmente. Os três contextos (Server Component, Server Action, Proxy) têm implementações ligeiramente diferentes porque o objeto `cookies()` do Next.js se comporta diferente em cada contexto.

5. **Inserção de profile após cadastro** — após `supabase.auth.signUp()`, inserir o registro em `public.profiles` usando o `service role client` (server-side) para contornar a RLS de inserção.

6. **Login split-layout desktop-first** — o `view.tsx` do login usa grid `lg:grid-cols-2`. Em mobile, apenas o formulário é exibido; o painel com a logo é oculto com `hidden lg:flex`.

7. **`SidebarNav` e `usePathname`** — `usePathname` só funciona em Client Components. O `SidebarNav` deve ter `"use client"` no topo. O `Sidebar/index.tsx` pai permanece Server Component e passa os itens como prop.

8. **Zod v4 breaking change** — A versão atual do Zod usa `z.string().min(n, { error: '...' })` em vez de `{ message: '...' }`. Confirmar a versão instalada antes de escrever schemas.

9. **`page.tsx` nunca recebe props de sessão** — a sessão é lida no `layout.tsx` (Server Component) e passada via props para o `CMSShell`, que repassa para `Sidebar` e `TopBar`. `page.tsx` permanece sem nenhuma lógica de auth.

---

## 8. Arquivos a Modificar/Criar

### Criar (novos)

| Arquivo | Descrição |
|---|---|
| `src/middleware.ts` | Proxy — proteção de rotas `/cms/*` |
| `src/lib/supabase/client.ts` | `createBrowserClient` |
| `src/lib/supabase/server.ts` | `createServerClient` para Server Components/Actions |
| `src/lib/supabase/middleware.ts` | `createServerClient` para uso no Proxy |
| `src/lib/supabase/types.ts` | `AdminRole`, `AdminProfile`, `SessionUser` |
| `src/app/(cms)/layout.tsx` | Layout CMS — verifica sessão, renderiza CMSShell |
| `src/app/(cms)/cms/login/page.tsx` | Server Component — sem lógica |
| `src/app/(cms)/cms/login/_features/login/schema.ts` | Zod schema login |
| `src/app/(cms)/cms/login/_features/login/view.tsx` | Client Component — formulário RHF |
| `src/app/(cms)/cms/login/_features/login/actions.ts` | Server Actions — signIn, signOut |
| `src/app/(cms)/cms/register/page.tsx` | Server Component |
| `src/app/(cms)/cms/register/_features/register/schema.ts` | Zod schema registro |
| `src/app/(cms)/cms/register/_features/register/view.tsx` | Client Component — formulário RHF |
| `src/app/(cms)/cms/register/_features/register/actions.ts` | Server Actions — signUp |
| `src/app/(cms)/cms/dashboard/page.tsx` | Dashboard — Server Component |
| `src/app/(cms)/cms/dashboard/_features/dashboard/view.tsx` | Conteúdo do dashboard |
| `src/components/cms/CMSShell.tsx` | Shell com Sidebar + conteúdo |
| `src/components/cms/Sidebar/index.tsx` | Server Component — container da sidebar |
| `src/components/cms/Sidebar/SidebarNav.tsx` | Client Component — links com usePathname |
| `src/components/cms/Sidebar/SidebarUserMenu.tsx` | Client Component — avatar + logout |
| `src/components/cms/TopBar/index.tsx` | Client Component — topbar do CMS |
| `docs/tech/adr/008-supabase-ssr-auth.md` | ADR-008 |
| `docs/tech/adr/009-cms-route-group.md` | ADR-009 |
| `docs/tech/adr/010-proxy-route-protection.md` | ADR-010 |
| `docs/tech/adr/011-rhf-zod-cms-forms.md` | ADR-011 |

### Modificar (existentes)

| Arquivo | Motivo |
|---|---|
| `package.json` | Adicionar `@supabase/supabase-js`, `@supabase/ssr`, `zod`, `react-hook-form`, `@hookform/resolvers` |
| `.env.local` | Adicionar variáveis Supabase |
| `docs/tech/architecture.md` | Adicionar seção do fluxo CMS ao diagrama geral |

---

## Diagrama de Fluxo de Auth

```
Browser → GET /cms/dashboard
    ↓
middleware.ts (Proxy)
  └─ lê cookie sb-* do Supabase
  └─ sem sessão → redirect /cms/login
  └─ com sessão → next()
    ↓
(cms)/layout.tsx (Server Component)
  └─ createServerClient → supabase.auth.getUser()
  └─ sem user → redirect /cms/login
  └─ com user → busca profile em public.profiles
  └─ renderiza CMSShell com user + profile
    ↓
(cms)/cms/dashboard/page.tsx
  └─ Server Component puro — sem lógica de auth
```

```
Browser → POST /cms/login (via Server Action)
    ↓
actions.ts
  └─ valida schema Zod server-side
  └─ supabase.auth.signInWithPassword()
  └─ erro → retorna { errors } para useActionState
  └─ sucesso → redirect /cms/dashboard
```
