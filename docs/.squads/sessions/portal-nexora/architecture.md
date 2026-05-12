# Decisão Arquitetural: Fluxo de Eventos (CMS + Plataforma)

**Data:** 2026-05-06
**Agent:** Ana Arquitetura

---

## Entendimento da Task

Implementar CRUD completo de eventos no CMS admin (`/cms/dashboard/eventos/`) seguindo o padrão MVVM já estabelecido no módulo de admins. Na plataforma pública, refatorar a listagem `/eventos` de dados hardcoded para busca via Supabase e criar a página de detalhe `/eventos/[slug]` como rota dinâmica nova.

---

## Estrutura de Componentes

### CMS — Gestão de Eventos

```
src/app/(cms)/cms/dashboard/eventos/
├── page.tsx                                    ← Server Component: busca lista + passa props
├── _features/EventosList/
│   └── view.tsx                                ← Client: tabela com filtros status/tipo + link editar + delete inline
├── novo/
│   ├── page.tsx                                ← Server Component puro
│   └── _features/NovoEvento/
│       ├── view.tsx                            ← Client: formulário completo (RHF)
│       ├── viewModel.tsx                       ← Client: useActionState, handlers de form
│       ├── schema.ts                           ← Zod: eventoSchema
│       └── actions.ts                          ← Server Action: criarEvento()
└── [id]/
    ├── page.tsx                                ← Server Component: busca evento por id + passa props
    ├── _features/EditarEvento/
    │   ├── view.tsx                            ← Client: mesmo form de criar, pré-populado
    │   ├── viewModel.tsx                       ← Client: useActionState, handlers
    │   ├── schema.ts                           ← reusar eventoSchema do novo/ (importar)
    │   └── actions.ts                          ← Server Actions: editarEvento() + excluirEvento()
    └── _features/DeleteEventoDialog/
        └── view.tsx                            ← Client: confirmação inline com useTransition
```

### Plataforma Pública — Eventos

```
src/app/(publics)/eventos/
├── page.tsx                                    ← Server Component: busca eventos do Supabase + passa props
├── _features/eventos/
│   ├── HeroEventos.tsx                         ← mantido, sem alteração
│   ├── ProximosEventos.tsx                     ← recebe Event[] do Supabase (type unificado)
│   └── EventosGravados.tsx                     ← recebe Event[] do Supabase (type unificado)
└── [slug]/
    ├── page.tsx                                ← Server Component: busca evento por slug + generateMetadata
    └── _features/EventoDetalhe/
        └── view.tsx                            ← Client: layout de detalhe (hero, descrição, CTA)
```

---

## Schema do Banco de Dados (Supabase)

```sql
create table public.events (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,                     -- gerado a partir do title, ex: "live-seguranca-digital"
  title       text not null,
  description text not null,
  long_description text,                                -- conteúdo rico para página de detalhe
  type        text not null check (type in ('ao_vivo', 'gravado')),
  status      text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  scheduled_at timestamptz,                             -- null para eventos gravados
  duration_minutes int,                                 -- duração estimada (ao vivo) ou real (gravado)
  thumbnail_url text,                                   -- URL da imagem de capa (Storage ou externa)
  youtube_url  text,                                    -- URL do YouTube (ao vivo ou gravado)
  created_by  uuid references auth.users(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- RLS: leitura pública para published; escrita só para autenticados
alter table public.events enable row level security;

create policy "events_public_read"
  on public.events for select
  using (status = 'published');

create policy "events_cms_write"
  on public.events for all
  using (auth.role() = 'authenticated');
```

**Notas:**
- `slug` é gerado no server action a partir do `title` (slugify) e garantido único via constraint
- `thumbnail_url` aceita path do Supabase Storage ou URL externa (YouTube thumbnail como fallback)
- `updated_at` atualizado via trigger padrão Supabase
- A coluna `type` (`ao_vivo` | `gravado`) substitui os dois arrays hardcoded atuais da página

---

## Decisões de Estado

| Estado | Tipo | Localização | Justificativa |
|--------|------|-------------|---------------|
| Lista de eventos (plataforma pública) | Fetch servidor | `eventos/page.tsx` | RSC busca do Supabase com `createServerClient()` — sem hidratação no cliente |
| Lista de eventos (CMS) | Fetch servidor | `cms/.../eventos/page.tsx` | Mesmo padrão de `admins/page.tsx` — adminClient, dados como props |
| Filtros de status/tipo (CMS) | URL search params | `EventosList/view.tsx` | `useSearchParams()` + `router.push()` — state persistido na URL, compartilhável |
| Formulário (criar/editar) | RHF + Zod | `view.tsx` + `viewModel.tsx` | ADR crítica: proibido `useState` para campos |
| Action state (criar/editar) | `useActionState` | `viewModel.tsx` | Padrão estabelecido em `NovoAdmin/viewModel.tsx` |
| Confirmação de exclusão | `useState<boolean>` | `DeleteEventoDialog/view.tsx` | Controla visibilidade do confirm inline — não é campo de form, `useState` permitido |
| Evento de detalhe (plataforma) | Fetch servidor | `eventos/[slug]/page.tsx` | RSC com `notFound()` se slug inválido |

---

## Contratos dos Componentes Principais

```typescript
// src/lib/supabase/types.ts — adicionar

type EventType = 'ao_vivo' | 'gravado'
type EventStatus = 'draft' | 'published' | 'archived'

type Event = {
  id: string
  slug: string
  title: string
  description: string
  long_description: string | null
  type: EventType
  status: EventStatus
  scheduled_at: string | null      // ISO string
  duration_minutes: number | null
  thumbnail_url: string | null
  youtube_url: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

// Props dos componentes de lista pública (substituem os types locais atuais)
type ProximosEventosProps = {
  eventos: Event[]
}

type EventosGravadosProps = {
  eventos: Event[]
}

// CMS list view
type EventosListViewProps = {
  eventos: Event[]
}

// Detalhe público
type EventoDetalheViewProps = {
  evento: Event
}

// Formulário (criar e editar compartilham o mesmo schema shape)
type EventoFormData = {
  title: string
  description: string
  long_description: string
  type: EventType
  status: EventStatus
  scheduled_at: string          // input datetime-local → string ISO no server action
  duration_minutes: number | ''
  thumbnail_url: string
  youtube_url: string
}

// ActionState (reusar o existente de src/lib/supabase/types.ts)
// type ActionState = { errors?: Record<string, string[]>; message?: string } | undefined
```

---

## Server Actions

```typescript
// cms/.../eventos/novo/_features/NovoEvento/actions.ts
'use server'
async function criarEvento(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState>
// → valida com eventoSchema, gera slug, insere via adminClient, redirect para /cms/dashboard/eventos

// cms/.../eventos/[id]/_features/EditarEvento/actions.ts
'use server'
async function editarEvento(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState>
// → valida com eventoSchema, regenera slug se title mudou, update via adminClient, redirect

async function excluirEvento(id: string): Promise<ActionState>
// → delete via adminClient, redirect para /cms/dashboard/eventos
// chamado pelo DeleteEventoDialog com useTransition

// src/utils/slugify.ts — função pura nova
function slugify(text: string): string
// → lowercase, remove acentos, troca espaços e especiais por "-"
// usada em criarEvento e editarEvento
```

---

## ADRs

### ADR-FE-002: Slug gerado server-side, não pelo usuário

**Contexto:** Eventos têm URL pública `/eventos/[slug]`. O slug precisa ser único e amigável para SEO. Expor um campo `slug` editável no formulário adiciona complexidade de UX (validação de unicidade em tempo real, sanitização) sem benefício claro para o MVP.

**Decisão:** O slug é gerado automaticamente no server action a partir do `title` via `slugify()` em `src/utils/slugify.ts`. Em caso de colisão (slug já existe), o server action acrescenta um sufixo numérico (`-2`, `-3` etc.) antes de inserir.

**Alternativas rejeitadas:**
- Campo slug editável no form — UX desnecessariamente complexa para MVP
- UUID como rota pública — péssimo para SEO e legibilidade

**Consequências:**
- `slugify()` vai em `src/utils/` (ADR-006) — reutilizável entre CMS e testes
- Se o admin editar o título de um evento já publicado, o slug é regenerado — URLs antigas quebram. Aceitável no MVP; nota para documentar ao produto.

---

### ADR-FE-003: Filtros de lista CMS via URL search params (não useState)

**Contexto:** A listagem de eventos do CMS precisa de filtros por `status` e `type`. Armazenar em `useState` perde o estado no refresh e impede compartilhamento de link com filtro aplicado.

**Decisão:** `EventosList/view.tsx` usa `useSearchParams()` para ler os filtros ativos e `useRouter().push()` (ou `<Link>` com query) para alterá-los. O `page.tsx` lê os `searchParams` e filtra os dados antes de passar como props, ou passa todos os eventos e delega o filtro ao client — preferência: filtro server-side para não expor eventos `draft` desnecessariamente via client.

**Alternativas rejeitadas:**
- `useState` para filtros — perde estado no refresh, não compartilhável
- Filtro só client-side — exporia todos os registros ao client, incluindo `draft`

**Consequências:**
- `page.tsx` recebe `searchParams` como prop (padrão Next.js App Router)
- Navegação entre filtros não causa loading completo (RSC partial rendering)

---

## Arquivos a Modificar/Criar

```
MODIFICAR:
- src/app/(publics)/eventos/page.tsx
  → remover arrays hardcoded; buscar eventos do Supabase; passar Event[] para componentes
- src/app/(publics)/eventos/_features/eventos/ProximosEventos.tsx
  → trocar type local ProximoEvento por Event de @/lib/supabase/types
- src/app/(publics)/eventos/_features/eventos/EventosGravados.tsx
  → trocar type local EventoGravado por Event de @/lib/supabase/types
- src/lib/supabase/types.ts
  → adicionar Event, EventType, EventStatus

CRIAR:
- src/utils/slugify.ts
- src/app/(publics)/eventos/[slug]/page.tsx
- src/app/(publics)/eventos/[slug]/_features/EventoDetalhe/view.tsx
- src/app/(cms)/cms/dashboard/eventos/page.tsx
- src/app/(cms)/cms/dashboard/eventos/_features/EventosList/view.tsx
- src/app/(cms)/cms/dashboard/eventos/novo/page.tsx
- src/app/(cms)/cms/dashboard/eventos/novo/_features/NovoEvento/view.tsx
- src/app/(cms)/cms/dashboard/eventos/novo/_features/NovoEvento/viewModel.tsx
- src/app/(cms)/cms/dashboard/eventos/novo/_features/NovoEvento/schema.ts
- src/app/(cms)/cms/dashboard/eventos/novo/_features/NovoEvento/actions.ts
- src/app/(cms)/cms/dashboard/eventos/[id]/page.tsx
- src/app/(cms)/cms/dashboard/eventos/[id]/_features/EditarEvento/view.tsx
- src/app/(cms)/cms/dashboard/eventos/[id]/_features/EditarEvento/viewModel.tsx
- src/app/(cms)/cms/dashboard/eventos/[id]/_features/EditarEvento/actions.ts
- src/app/(cms)/cms/dashboard/eventos/[id]/_features/DeleteEventoDialog/view.tsx
```

---

## Pontos de Atenção para o Dev

1. **`scheduled_at` no formulário:** usar `<input type="datetime-local" />` — o valor retorna string `"2026-05-14T15:00"`. O server action deve converter para ISO completo com timezone antes de inserir: `new Date(value).toISOString()`. Validar que o campo é obrigatório apenas quando `type === 'ao_vivo'` (refinement Zod).

2. **Filtro server-side no CMS:** `page.tsx` de eventos recebe `searchParams: { status?: string; type?: string }` e filtra via `.eq()` no Supabase antes de passar para `EventosListView`. Não passar dados `draft` para o client na plataforma pública.

3. **`excluirEvento` com `useTransition`:** o botão de excluir no `DeleteEventoDialog` deve usar `useTransition` para mostrar estado de loading sem bloquear UI. Padrão: `const [isPending, startTransition] = useTransition()` + `startTransition(() => excluirEvento(id))`.

4. **`generateMetadata` no detalhe público:** `eventos/[slug]/page.tsx` deve exportar `generateMetadata` usando `title` e `description` do evento. Se slug não existe, chamar `notFound()` antes de chegar no render.

5. **`thumbnail_url` nulo:** `ProximosEventos` e `EventosGravados` usam `next/image` — se `thumbnail_url` for `null`, usar imagem placeholder (`/images/event-placeholder.jpg`) para evitar erro de `src` vazio. Adicionar domínios do Supabase Storage em `next.config.ts` (seção `images.remotePatterns`).

6. **Sidebar do CMS:** adicionar item "Eventos" no `SidebarNav.tsx` apontando para `/cms/dashboard/eventos`. Não esquecer o ícone adequado do lucide (`CalendarDays`).

7. **Schema compartilhado entre criar e editar:** `EditarEvento/schema.ts` deve importar e reexportar `eventoSchema` de `novo/_features/NovoEvento/schema.ts` — não duplicar a definição (ADR-006).

8. **`npm run build` obrigatório** ao final de cada subtask — zero erros TypeScript antes de marcar como feito.
