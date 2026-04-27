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
