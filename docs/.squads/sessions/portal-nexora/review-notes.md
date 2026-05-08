# Review Notes: portal-nexora

> Notas de revisão de todos os roles. Append-only.

---

# Review Notes — Migração HTML → Next.js App Router

**Data:** 2026-04-25
**Reviewer:** Renata Revisão

## Resumo
- BLOCKERs: 1
- SUGGESTIONs: 3
- QUESTIONs: 1
- PRASEs: 3

## Comentários

---

[BLOCKER] `src/app/eventos/page.tsx` — URL duplicada no `eventosGravados`

Por que é um problema: o evento "Desenvolvendo com Segurança" usa `youtubeUrl: "https://www.youtube.com/watch?v=IZyad7yAiOk"`, que é o mesmo link do terceiro evento ("GitHub para portfólio"). O HTML legado mostrava `watch?v=Wwet0QK8yJU` como link da imagem e `watch?v=IZyad7yAiOk` no botão — inconsistência do original. Manter o link errado faz o usuário clicar em outro vídeo.

Fix sugerido:
```typescript
// Usar o link correto da imagem do original como youtubeUrl do evento 2
{
  id: "desenvolvendo-com-seguranca",
  title: "Desenvolvendo com Segurança",
  youtubeUrl: "https://www.youtube.com/watch?v=Wwet0QK8yJU",
  // ...
}
```
Confirmar com o dono do conteúdo qual é o vídeo correto.

---

[SUGGESTION] `src/components/layout/Header/Header.tsx` — padrão de visibilidade do `<nav>`

O comportamento atual usa `{ hidden: !menuOpen, flex: menuOpen }` combinado com `md:flex` na base. Funciona, mas a intenção fica difícil de ler. Um padrão mais claro e à prova de tailwind-merge:

```tsx
className={cn(
  "absolute top-full left-0 right-0 bg-blue-900 flex-col",
  "md:static md:flex md:flex-row md:items-center",
  menuOpen ? "flex" : "hidden md:flex",
)}
```

Sem objects — mais legível e sem risco de conflito de merge.

---

[SUGGESTION] `src/app/eventos/page.tsx` e `src/app/page.tsx` — dados hardcoded nas páginas

Cursos, projetos, impacto e eventos estão declarados como constantes no corpo do arquivo de página. Quando a quantidade de dados crescer ou vier de Supabase, a refatoração vai ser maior. Considerar mover para um arquivo `data.ts` colocalizado (dentro de `_features/home/` e `_features/eventos/`) já agora, mesmo que os dados ainda sejam estáticos.

Não é blocker — o código funciona — mas sinalizo antes de escalar.

---

[SUGGESTION] `public/images/live_segurança.jpeg` — caractere especial no nome do arquivo

O `ç` no nome pode causar inconsistência em sistemas de arquivos case-sensitive (Linux/Vercel) ou ao fazer encoding da URL. Não é blocker se o arquivo existe e o servidor serve corretamente, mas o ideal é renomear para `live_seguranca.jpeg` para evitar surpresas no deploy.

---

[QUESTION] `src/components/layout/Header/Header.tsx` — botão "Entrar" aponta para `/login`

A rota `/login` ainda não existe no projeto. O link está correto conceitualmente, mas vai retornar 404. Isso é intencional (placeholder para futura implementação) ou deveria ser `href="#"` por ora?

---

[PRAISE] Acessibilidade consistente em todos os componentes

Cada `<section>` tem `aria-labelledby` apontando para o `id` do heading correspondente. Imagens com `alt` descritivo (não apenas `alt=""`). Botões e links com `aria-label` onde o texto visível não é suficiente. Padrão de acessibilidade acima da média para o estágio inicial do projeto.

---

[PRAISE] Empty states implementados em `ProximosEventos` e `EventosGravados`

As seções com listas dinâmicas têm branches explícitos para lista vazia, seguindo o padrão de 4 estados (loading/error/empty/data). Mesmo sendo dados estáticos hoje, a estrutura está pronta para receber async sem refatoração de render.

---

[PRAISE] ADR-007 seguida rigorosamente

`cn()` usado em **todo** `className`, incluindo classes estáticas de componentes simples como `Footer`. Zero bypass com template string ou concatenação direta. Exemplo correto que vai servir de referência para futuros componentes.

---

## Decisão

**Aprovado com ressalvas — requer correção do BLOCKER antes de deploy.**

O BLOCKER (URL duplicada do evento 2) é factual e impacta o usuário. As SUGGESTIONs são melhorias não-bloqueantes. A QUESTION sobre `/login` precisa de decisão do produto.

---

# Review Notes — UI/UX Redesign com Shadcn/UI

**Data:** 2026-04-25
**Reviewer:** Renata Revisão

## Resumo
- BLOCKERs: 0
- SUGGESTIONs: 1
- QUESTIONs: 0
- PRASEs: 3

## Comentários

---

[SUGGESTION] `Header.tsx` — padrão `render={<Link />}` em Button é novo no projeto

O padrão `render={<Link href="..." />}` é correto para base-ui (substitui `asChild` do Radix). Funciona, mas é desconhecido para quem não conhece base-ui. Considerar documentar em `docs/_memory/project-learnings.md` para que futuros componentes sigam o mesmo padrão sem descobrir por tentativa.

---

[PRAISE] Sheet substitui o menu CSS hack com acessibilidade real

O Shadcn `Sheet` provê trap de foco, fechamento por ESC, backdrop e aria-modal. A troca elimina todos os problemas de acessibilidade mobile do menu anterior sem adicionar código custom. Decisão arquitetural excelente.

---

[PRAISE] Cards com hover effect em `EventosGravados`

O `group-hover:scale-105` no thumbnail + overlay com `PlayCircle` cria uma experiência visual clara de "clicável" sem JavaScript. Padrão declarativo limpo que funciona sem hidratação client-side.

---

[PRAISE] Footer refatorado para layout responsivo com links

O Footer agora tem descrição da marca, links de navegação e copyright — alinhado com o padrão de produto. O uso de `Separator` do Shadcn para a divider é consistente com o design system.

---

## Decisão

**Aprovado. Zero BLOCKERs.**

O redesign Shadcn está bem executado. A SUGGESTION de documentar o padrão `render` não bloqueia nada.

---

# Review Notes — CMS: Criar Novos Administradores

**Data:** 2026-04-30
**Reviewer:** Renata Revisão

## Resumo
- BLOCKERs: 1
- SUGGESTIONs: 2
- QUESTIONs: 1
- PRASEs: 3

## Comentários

---

[BLOCKER] `actions.ts` — usuário auth órfão se inserção de profile falhar

Por que é um problema: `auth.admin.createUser()` é chamado primeiro e tem sucesso. Se o `.insert()` em `admin_profiles` falhar em seguida (constraint, timeout, permissão), o usuário existe em `auth.users` mas sem profile. Na próxima tentativa de login, `dashboard/layout.tsx` recebe `profile: null` — o usuário entra no sistema sem role. Além disso, a mesma conta não pode ser criada novamente pois o e-mail já existe no Auth.

Fix sugerido:
```typescript
if (profileError) {
  // limpar o usuário auth para manter consistência
  await adminClient.auth.admin.deleteUser(authData.user.id)
  return { message: 'Erro ao criar administrador. Tente novamente.' }
}
```

---

[SUGGESTION] `view.tsx` — `<select>` nativo pode ter background branco em alguns navegadores

`bg-transparent` no `<select>` nativo não é respeitado de forma consistente em todos os browsers (especialmente Safari e Windows). Pode exibir fundo branco dentro de um contexto dark mode. Não é crítico agora (sem dark mode confirmado), mas sinalizo para quando o tema for implementado.

---

[SUGGESTION] `actions.ts` — mensagem de erro genérica do Supabase pode vazar informação

`authError?.message` do Supabase pode retornar strings em inglês como `"User already registered"`. Considerar mapear para mensagens em português antes de retornar:
```typescript
const isEmailTaken = authError?.message?.includes('already registered')
return { message: isEmailTaken ? 'Este e-mail já está em uso.' : 'Erro ao criar conta.' }
```

---

[QUESTION] `viewModel.tsx` — `router.back()` no cancelar

Se o usuário acessar `/cms/dashboard/admins/novo` diretamente (ex: via bookmark), `router.back()` vai navegar para fora do CMS. Isso é comportamento esperado, ou deveria haver um fallback para `/cms/dashboard`?

---

[PRAISE] Separação view / viewModel executada corretamente pela primeira vez no CMS

Esta é a primeira feature do CMS a usar `viewModel.tsx` separado, seguindo o ADR-004 na íntegra. O `view.tsx` é puro JSX + Shadcn — zero lógica. O `viewModel.tsx` encapsula `useActionState`, `useForm`, `useRouter` e `handleCancel`. Vai servir de referência para refatorar as features existentes (`/cms/register`, `/cms/login`).

---

[PRAISE] `ROLE_OPTIONS as const` + `key={opt.value}` — padrão correto para listas estáticas

Array de opções definido como `as const` fora do componente (não recriado a cada render) com `key` estável usando `opt.value`. Pequeno detalhe, mas revela atenção ao desempenho mesmo em listas pequenas.

---

[PRAISE] `criarAdmin` com validação Zod server-side antes de tocar no Supabase

O Server Action valida o FormData com Zod antes de qualquer chamada ao banco. Mesmo que o cliente quebre a validação (JS desativado, request manual), os dados nunca chegam ao Supabase sem passar pelo schema. Defesa em profundidade aplicada corretamente.

---

## Decisão

**Requer correção do BLOCKER** — usuário auth órfão é um problema de consistência de dados real.

---

# Review Notes — Identidade Visual + Redesign da Home

**Data:** 2026-05-02
**Reviewer:** Renata Revisão

## Resumo
- BLOCKERs: 0
- SUGGESTIONs: 4
- QUESTIONs: 0
- PRASEs: 5

## Comentários

[SUGGESTION] `HeroSection.tsx` — SVG placeholder usa hex `#5EEAD4` hardcoded nos atributos SVG. Como é decorativo e `aria-hidden="true"`, não bloqueia. Candidato a `currentColor` em iteração futura.

[SUGGESTION] `page.tsx` — `heroStats` e `impactoItems` duplicam os mesmos valores (500/30/15) em estruturas diferentes. Não é bug, mas é candidato a uma fonte única de dados quando vier de Supabase.

[SUGGESTION] `TestimonialsSection.tsx` — stars usam `key={i}` (índice) em uma lista estática imutável de exatamente 5 elementos. É aceitável aqui pois a lista nunca muda de ordem ou tamanho, mas deveria ter um comentário para evitar confusão em reviews futuros.

[SUGGESTION] `TestimonialsSection.tsx` — `footer` dentro de `blockquote` é válido mas pode ser interpretado como "rodapé de seção" por alguns screen readers. Alternativa semântica mais clara: `figure`/`figcaption`. Não bloqueante.

[PRAISE] `page.tsx` permanece Server Component puro — ADR-004 respeitada impecavelmente mesmo com a adição de 3 novos blocos de dados.

[PRAISE] `TestimonialsSection` usa `<article>` para cada depoimento — semântica HTML5 correta para conteúdo independente e potencialmente sindicável.

[PRAISE] `role="img"` + `aria-label="5 estrelas"` no container das estrelas — tratamento proativo de acessibilidade para ícones que comunicam informação.

[PRAISE] `aria-hidden="true"` consistente em todos os elementos decorativos (SVG hero, avatar initials).

[PRAISE] Build `npm run build` passou limpo — zero erros TypeScript. Requisito mínimo atendido.

## Decisão

**Aprovado. Zero BLOCKERs.**

---

# Review Notes — Fluxo de Eventos (CMS + Plataforma)

**Data:** 2026-05-06
**Reviewer:** Renata Revisão

## Resumo
- BLOCKERs: 1
- SUGGESTIONs: 4
- QUESTIONs: 1
- PRASEs: 6

## Comentários

---

[BLOCKER] `formatDate` / `formatTime` duplicadas em 3 arquivos — CONFLITO ADR-006

Por que é um problema: `formatDate` aparece em `EventosList/view.tsx:33`, `ProximosEventos.tsx:19` e `EventoDetalhe/view.tsx:12`. `formatTime` aparece em `ProximosEventos.tsx:27` e `EventoDetalhe/view.tsx:20`. ADR-006 exige extração para `src/utils/` após a segunda duplicação (Rule of Three atingido). Qualquer mudança de formatação exige editar 3 arquivos.

Fix sugerido:
```typescript
// src/utils/formatDate.ts
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
  })
}
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit", minute: "2-digit",
  })
}
```
Importar via `@/utils/formatDate` nos 3 arquivos. `EventoDetalhe/view.tsx` usa `month: "long"` — criar `formatDateLong` ou unificar.

---

[SUGGESTION] Páginas públicas usando `createAdminClient()` (service role)

`eventos/page.tsx` e `eventos/[slug]/page.tsx` públicas usam `createAdminClient()`. Correto é `createClient()` (anon key + RLS) para dados públicos. A policy `events_public_read` já filtra `status = 'published'` — o `.eq("status", "published")` manual ficaria redundante. Service role deve ser reservado ao CMS.

---

[SUGGESTION] `EventoDetalheView` usa classes `prose` — verificar plugin typography

`eventos/[slug]/_features/EventoDetalhe/view.tsx:91` usa `prose prose-slate`. Sem `@tailwindcss/typography` no projeto, as classes são ignoradas silenciosamente. Verificar `package.json`; se ausente, remover as classes `prose`.

---

[SUGGESTION] `slugify.ts` — regex com caracteres Unicode literais

`src/utils/slugify.ts:4` usa `/[̀-ͯ]/g` com chars reais. Substituir por `/[̀-ͯ]/g` para clareza e segurança de encoding.

---

[SUGGESTION] `DeleteEventoDialog` usa `window.confirm()` — acessibilidade limitada

OK para MVP. Para iteração futura: substituir por dialog Shadcn com foco gerenciado.

---

[QUESTION] Slug regenerado ao editar título?

`editarEvento` action não atualiza o slug quando o título muda. A ADR-FE-002 mencionou o risco de URLs quebrarem. Confirmar comportamento esperado: slug imutável após criação, ou regenerar?

---

[PRAISE] `useTransition` para exclusão — padrão correto. UI responsiva durante o request sem bloquear a página.

[PRAISE] `generateMetadata` + `notFound()` nas rotas dinâmicas — zero chance de render com dados `undefined`.

[PRAISE] Filtro server-side no CMS — eventos `draft` nunca chegam ao client bundle.

[PRAISE] Schema compartilhado entre Criar e Editar — `EditarEvento/schema.ts` importa e reexporta sem duplicar.

[PRAISE] Zod refinement condicional para `scheduled_at` — validação robusta server-side para campo obrigatório apenas em `ao_vivo`.

[PRAISE] MVVM consistente em 100% das features novas — `view.tsx` sem lógica, `viewModel.tsx` sem JSX, em todos os formulários.

---

## Decisão

**Requer correção do BLOCKER** — `formatDate`/`formatTime` duplicadas violam ADR-006. Fix simples: `src/utils/formatDate.ts` + importar nos 3 arquivos afetados.
