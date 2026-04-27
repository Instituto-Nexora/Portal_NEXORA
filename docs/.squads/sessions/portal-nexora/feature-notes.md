# Feature Notes: Migração HTML → Next.js App Router

**Data:** 2026-04-25
**Squad:** frontend-001

---

## O que foi implementado

- **2 rotas Next.js App Router**: `src/app/page.tsx` (home) e `src/app/eventos/page.tsx` substituem `index.html` e `eventos.html`
- **Layout compartilhado** (`src/app/layout.tsx`) atualizado com `<Header>` e `<Footer>` globais, metadata em pt-BR
- **Header responsivo** (`src/components/layout/Header/`) como Client Component com menu hambúrguer via `useState` — único ponto de interatividade client-side
- **10 componentes de feature** em `src/_features/home/` e `src/_features/eventos/` mapeando cada seção das páginas legadas; todos Server Components exceto o Header
- **Imagens migradas** de `imagens/` para `public/images/` e servidas via `<Image>` do Next.js com `alt` descritivo em todas

---

## Decisões técnicas tomadas

- **Dados hardcoded nas páginas por ora**: `cursos`, `projetos`, `impacto` e `eventos` declarados como constantes em `page.tsx` e `eventos/page.tsx`. Decisão consciente — sem API Supabase ainda. Quando vier o backend, extrair para `data.ts` ou server actions.
- **`_features/` sem `view.tsx`/`viewModel.tsx`**: as páginas são estáticas sem formulários ou lógica de negócio, então o padrão MVVM completo (ADR-004) foi simplificado para componentes diretos. Qualquer página que ganhar formulário ou estado complexo deve migrar para MVVM completo.
- **Sem `tailwind.config.js`**: cores da marca (`blue-900`, `emerald-500`, `gray-100`) usam classes utilitárias padrão do Tailwind v4 que correspondem visualmente ao CSS legado (`#1e3a8a`, `#10b981`, `#f3f4f6`). Se a paleta mudar, criar variáveis em `globals.css` via `@theme`.

---

## Pontos de atenção para manutenção futura

1. **`/login` ainda não existe**: o botão "Entrar" no Header aponta para `/login` — retorna 404. Criar a rota ou mudar para `href="#"` enquanto não implementada.
2. **`live_segurança.jpeg`**: nome do arquivo com `ç` pode causar problemas em deploys Linux/Vercel. Renomear para `live_seguranca.jpeg` e atualizar o `imageUrl` em `eventos/page.tsx`.
3. **Dados estáticos**: conteúdo de cursos, projetos e eventos está hardcoded. Quando o Supabase for integrado, mover para Server Actions ou `generateStaticParams`.
4. **`_features/` não é roteado**: a pasta `_features/` usa `_` para ficar invisível ao App Router do Next.js. Manter esse padrão.

---

## BLOCKERs resolvidos do review

- **[BLOCKER] URL duplicada em `eventos/page.tsx`**: "Desenvolvendo com Segurança" apontava para o mesmo `youtubeUrl` do evento seguinte (`IZyad7yAiOk`). Corrigido para `watch?v=Wwet0QK8yJU` conforme o link da imagem original no HTML legado.

---

## SUGGESTIONs pendentes (débito técnico)

| Sugestão | Prioridade | Motivo de adiar |
|---|---|---|
| Refatorar padrão de visibilidade do `<nav>` no Header | Baixa | Funciona corretamente; melhoria de legibilidade apenas |
| Mover dados hardcoded para `data.ts` em `_features/` | Média | Aguardando integração com Supabase para definir estrutura final |
| Renomear `live_segurança.jpeg` para remover `ç` | Média | Não bloqueia localmente; risco no deploy Vercel |
| Criar rota `/login` ou ajustar href do Header | Alta | Depende de decisão de produto sobre o fluxo de auth |
