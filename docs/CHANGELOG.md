# Changelog

> Registro de mudanças em documentos de negócio e produto.

---

## [2026-05-23] — Listagem de cursos adquiridos (Minha Área)

### Adicionado

- `src/app/(publics)/minha-area/page.tsx` — página protegida de listagem de cursos do aluno (task #24)
- `src/app/(publics)/minha-area/_features/MinhAreaCursos/CursoCard.tsx` — card com progresso e botão condicional (Continuar / Baixar Certificado)
- `src/app/(publics)/minha-area/_features/MinhAreaCursos/EmptyState.tsx` — estado vazio com CTA
- `src/app/(publics)/minha-area/loading.tsx` — skeleton de carregamento do grid
- `src/components/ui/progress.tsx` — componente Progress via `@base-ui/react/progress`

### Alterado

- `src/components/layout/globals.css` — conflito de merge resolvido; mantida versão do `main` com `overflow-x-hidden` no body e classe `.nexora-scrollbar`
- `src/app/(cms)/cms/dashboard/eventos/[id]/_features/EditarEvento/view.tsx` — conflito de merge resolvido; mantida versão do `main` com layout responsivo e sticky footer

### Pendente

- `src/utils/calcularProgressoCurso.ts` — import já referenciado em `minha-area/page.tsx`; módulo será criado na issue #22

---

## [2026-05-09] — CMS responsivo, estados de carregamento e 404 global

### Adicionado

- `src/components/cms/CMSMobileSidebar.tsx` — menu lateral mobile do CMS com `Sheet`, acionamento por ícone e navegação completa.
- `src/app/loading.tsx` — tela global de carregamento com spinner e skeletons, alinhada ao design system.
- `src/app/not-found.tsx` — tela global de 404 Not Found com CTAs para início e eventos.
- Skeletons locais para páginas do CMS que dependem de dados do Supabase:
  - `/cms/dashboard`
  - `/cms/dashboard/admins`
  - `/cms/dashboard/eventos`

### Alterado

- Sidebar do CMS passou a usar modo compacto em desktop, com ícones e tooltips.
- Topbar do CMS recebeu gatilho mobile para abrir/fechar a navegação lateral.
- Dashboard, administradores e eventos receberam ajustes responsivos para telas pequenas.
- Listagem de administradores usa cards no mobile e tabela no desktop.
- Filtros de eventos foram realinhados com ícone, selects e botões em altura consistente.

### Corrigido

- Corrigidos warnings/erros da Base UI em `/cms/dashboard/admins` e `/cms/dashboard/eventos` causados por `Button` renderizando `Link` sem `nativeButton={false}`.
- Corrigido aviso de performance no avatar do menu do usuário ao trocar `<img>` por `next/image`.

## [2026-04-25] — MVP: Criar Tarefas no GitHub Projects

### Adicionado

- `docs/specs/mvp-tasks-v1.md` — Spec completa para criação de 4 epics (Landing Page, Cursos, Auth, Eventos) com ~31 sub-tarefas no GitHub Projects
- `docs/business/index.md` — Índice consolidado de documentação de negócio
