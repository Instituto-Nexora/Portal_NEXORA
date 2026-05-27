# Feature Notes: CMS — Criar Novos Administradores

**Data:** 2026-04-30
**Squad:** frontend-001

## O que foi implementado

- `src/lib/supabase/admin.ts` — `createAdminClient()` com service role key (sem cookie handling), separado do client padrão
- `src/app/(cms)/cms/dashboard/admins/novo/page.tsx` — Server Component puro com metadata, sem lógica
- `_features/NovoAdmin/schema.ts` — Zod schema com refinamento de confirmação de senha e enum de roles
- `_features/NovoAdmin/viewModel.tsx` — `useActionState` + `useForm` + `useRouter` encapsulados, sem JSX
- `_features/NovoAdmin/view.tsx` — UI pura com Shadcn + `<select>` nativo estilizado; zero lógica
- `_features/NovoAdmin/actions.ts` — Server Action usando `auth.admin.createUser` + rollback via `deleteUser` se o profile falhar

## Decisões técnicas tomadas

- **`<select>` nativo** em vez de Shadcn Select (não instalado). Estilizado com classes Tailwind compatíveis com a altura/border do `<Input>`.
- **`flatten((issue) => issue.message)`** — Zod v4 deprecou a assinatura zero-argumento de `.flatten()`. A forma correta em v4 é passar um mapper.
- **Rollback explícito**: se a inserção em `admin_profiles` falhar após `createUser`, o auth user é deletado imediatamente. Mantém consistência sem depender de triggers ou jobs externos.
- **`router.back()` no cancelar**: decisão deliberada — o comportamento padrão é voltar na história do browser. Se acessado diretamente, navega para fora do CMS (comportamento aceitável; listagem de admins está fora do escopo desta task).

## Pontos de atenção para manutenção futura

1. **`SUPABASE_SERVICE_ROLE_KEY`** deve existir em `.env.local` (e nas variáveis de ambiente do Vercel). A ausência faz `createAdminClient()` criar um client com chave `undefined`, e `auth.admin.*` retorna 401 silenciosamente.
2. **`auth.admin.createUser`** requer que o projeto Supabase tenha Auth habilitado e que a service role key tenha permissão de admin. Verificar no dashboard Supabase se a key é a correta.
3. **Rota `/cms/dashboard/admins/novo`** está protegida pelo `proxy.ts` herdado do `(cms)/layout.tsx`. Não precisa de proteção adicional na page.tsx.
4. **`select` nativo no dark mode** pode exibir fundo branco em alguns browsers. Se o projeto implementar dark mode, considerar trocar por Shadcn Select ou uma lib de select acessível.
5. **Mensagem de erro do Supabase** (`authError?.message`) pode vir em inglês. Mapear para pt-BR antes de expor ao usuário é uma melhoria futura pendente.

## BLOCKERs resolvidos do review

- **[BLOCKER] Usuário auth órfão**: corrigido adicionando `await adminClient.auth.admin.deleteUser(authData.user.id)` antes do `return` de erro no profile. O banco retorna a um estado consistente em caso de falha parcial.

## SUGGESTIONs pendentes (débito técnico)

- **`select` nativo / bg-transparent**: cosmético, a tratar quando dark mode for implementado
- **Mensagem de erro do Supabase em inglês**: mapear `authError?.message` para pt-BR na próxima iteração do CMS

---

# Feature Notes: Fluxo de Eventos (CMS + Plataforma)

**Data:** 2026-05-06
**Squad:** frontend-001

## O que foi implementado

- Tipos `Event`, `EventType`, `EventStatus` adicionados em `src/lib/supabase/types.ts` — modelo unificado consumido por CMS e plataforma pública
- CRUD completo de eventos no CMS: listagem com filtros server-side, criação, edição e exclusão (`/cms/dashboard/eventos/*`)
- Rota pública `/eventos` refatorada de dados hardcoded para Supabase, com componentes `ProximosEventos` e `EventosGravados` adaptados ao tipo unificado
- Rota pública `/eventos/[slug]` com `generateMetadata`, `notFound()` e view de detalhe do evento
- Utilitários `slugify()` (`src/utils/slugify.ts`) e `formatDate`/`formatDateLong`/`formatTime` (`src/utils/formatDate.ts`) extraídos como funções puras reutilizáveis

## Decisões técnicas tomadas

- **Schema Zod sem `.transform()`** em `duration_minutes`: conversão string→number feita manualmente na Server Action (`Number(parsed.data.duration_minutes)`) para manter compatibilidade com `useForm<EventoFormData>` (inferência de tipo quebra com transform)
- **`.url()` do Zod v4 depreciado**: substituído por `z.string().optional()` nos campos de URL; validação HTML5 via `type="url"` no input cuida do lado cliente
- **`formatDate`/`formatTime` extraídas** durante review (3ª duplicação atingida = BLOCKER ADR-006) — `src/utils/formatDate.ts` é agora o utilitário canônico para datas pt-BR
- **`DeleteEventoDialog` sem form**: padrão `useTransition` + Server Action chamada diretamente no handler do botão, sem `<form>`

## Pontos de atenção para manutenção futura

1. Páginas públicas `/eventos` e `/eventos/[slug]` usam `createAdminClient()` (service role) em vez de `createClient()` (anon key + RLS) — funcionalmente correto para MVP, mas semanticamente errado; migrar para `createClient()` quando RLS de leitura estiver configurado
2. `EventoDetalhe/view.tsx` usa classes `prose prose-slate` — verificar se `@tailwindcss/typography` está instalado; se não, remover as classes para evitar estilos órfãos
3. Slug não é regenerado ao editar título — comportamento esperado para MVP, mas quebra URLs existentes se o admin alterar o título de um evento publicado; implementar redirect ou campo slug editável em iteração futura
4. `DeleteEventoDialog` usa `window.confirm()` — substituir por dialog Shadcn em iteração futura para manter consistência de UI

## BLOCKERs resolvidos do review

- **[BLOCKER] ADR-006 — 3ª duplicação de `formatDate`/`formatTime`**: funções extraídas para `src/utils/formatDate.ts`; todos os pontos de uso atualizados para importar do utilitário canônico

## SUGGESTIONs pendentes (débito técnico)

1. **(Alta)** Migrar `createAdminClient()` nas rotas públicas para `createClient()` com anon key + RLS configurado no Supabase
2. **(Média)** Verificar e resolver dependência `@tailwindcss/typography` para as classes `prose` em `EventoDetalhe/view.tsx`
3. **(Baixa)** Substituir `window.confirm()` no `DeleteEventoDialog` por `<AlertDialog>` do Shadcn
4. **(Baixa)** Avaliar estratégia de slug imutável vs. redirect ao editar título de evento publicado

---

# Feature Notes — Identidade Visual + Redesign da Home

**Data:** 2026-05-02
**Squad:** frontend-001
**Agent:** Ana Arquitetura

## O que foi feito

Redesign completo da home com identidade visual própria baseada em análise de Udemy, Alura e Hotmart.

### Sistema de Design

**Paleta Deep Teal + Amber** definida em `globals.css` via CSS custom properties:

| Token CSS | Uso |
|---|---|
| `--brand-primary` / `teal-700` `#0F766E` | Botões, ícones, `--primary` Shadcn |
| `--brand-teal-hero` / `teal-900` `#0D3D37` | Background do hero |
| `--brand-accent` / `amber-500` `#F59E0B` | CTAs primários, stats, stars |

**Tipografia:** Inter (sistema) — `font-black` no H1, `font-bold` nos H2.

### Nova estrutura da home

```
HeroSection → ImpactoSection → CursosDestaque → ProjetosSociais → TestimonialsSection → ParceirosCTA
```
ImpactoSection foi movida para posição 2 (social proof acima do fold).

### Arquivos modificados

`globals.css` · `page.tsx` · `HeroSection.tsx` · `ImpactoSection.tsx` · `CursosDestaque.tsx` · `ProjetosSociais.tsx` · `ParceirosCTA.tsx`

### Arquivo criado

`TestimonialsSection.tsx` — 3 depoimentos com stars amber, avatar com iniciais, semântica `article`/`blockquote`.

## Decisões técnicas

- `HeroSection` agora recebe `stats` como prop — split layout com painel de stats à direita em desktop
- `--primary` Shadcn remapeado para teal-700 (afeta todos os componentes que usam `bg-primary`)
- Todos os componentes da home permanecem Server Components puros (ADR-004)
- `cn()` em todos os `className` (ADR-007)

## SUGGESTIONs pendentes (débito técnico)

- SVG placeholder no hero → substituir por ilustração real ou `next/image` quando asset disponível
- `heroStats` e `impactoItems` em page.tsx → unificar em fonte única quando dados vierem do Supabase
- `blockquote`/`footer` nos depoimentos → considerar `figure`/`figcaption` para melhor semântica
- Verificar visualmente o CMS após remapeamento de `--primary` para teal

---

# Feature Notes — Depoimentos de Alunos na Página de Vendas

**Data:** 2026-05-27
**Squad:** frontend-001
**Task:** #14 — Exibir depoimentos de alunos em /vendas (sub-task da Epic #6)

## O que foi implementado

- `src/app/(publics)/vendas/_features/vendas/DepoimentosVendas.tsx` — Server Component com seção de depoimentos de alunos; grid 2-3 colunas desktop, empilhado mobile; 3 depoimentos hardcoded com `resultado` concreto, badge teal, stars amber, avatar com iniciais

## Decisões técnicas

- `page.tsx` de `/vendas` **não criado** — escopo da issue #10; componente pronto para integração
- MVVM não aplicado — componente estático sem lógica (ADR-004 não exige para Server Components puros)
- Badge de resultado: `ring-inset` (padrão Tailwind v4), símbolo `✓` com `aria-hidden="true"`

## Pontos de atenção para manutenção futura

1. Integrar em `vendas/page.tsx` (issue #10): importar `DepoimentosVendas` sem props
2. Migração Supabase futura: `type Depoimento` já tem `id: string` — compatível com tabela `testimonials`

## SUGGESTIONs pendentes (débito técnico)

- **(Baixa)** Extrair `depoimentos[]` para `_features/vendas/_data/depoimentos.ts` quando crescer
