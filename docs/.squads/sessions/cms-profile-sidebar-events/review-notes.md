# Review Notes: cms-profile-sidebar-events

> Notas de revisão de todos os roles. Append-only.

## [frontend-001 · renata-revisao-fe] — 2026-05-12

### BLOCKER

Nenhum blocker encontrado nos arquivos alterados. `npm run build` passou com Next.js 16.2.4.

### SUGGESTION

- Aplicar a migration `src/databases/00004_cms_profile_preferences.sql` antes de testar upload real de avatar em ambiente Supabase, pois o bucket `avatars` precisa existir.
- Planejar uma segunda etapa para OTP real por e-mail e exclusão definitiva de conta, pois foram deixados bloqueados por segurança conforme escopo incremental aprovado.
- Corrigir o lint global do projeto fora do escopo desta feature: `.synapos/.manifest.json` inválido e arquivos antigos de cadastro/auth possuem avisos/erros Biome.

### QUESTION

- A política futura de exclusão de conta deve remover também conteúdos/eventos criados pelo admin ou apenas desativar o acesso?

### PRAISE

- Sidebar migrada para composição Shadcn-like sem nova dependência externa.
- Rota de perfil segue MVVM e mantém `page.tsx` como Server Component.
- Arquivos alterados nesta feature passam em Biome scoped check.


## [frontend-001 · renata-revisao-fe] — 2026-05-12 · bug-fix visual

### BLOCKER

Nenhum blocker encontrado. `npm run build` passou após correções de scroll/sidebar/perfil.

### SUGGESTION

- Retestar visualmente `/cms/dashboard` e `/cms/dashboard/perfil` com sidebar expandida e colapsada.
- Se ainda houver overflow horizontal, verificar componentes específicos com conteúdo dinâmico longo (ex.: e-mail ou slugs).

### PRAISE

- Scroll externo do CMS foi convertido para scroll interno com barra estilizada.
- Sidebar colapsada agora preserva ícones e logo sem exibir letras truncadas dos labels.
