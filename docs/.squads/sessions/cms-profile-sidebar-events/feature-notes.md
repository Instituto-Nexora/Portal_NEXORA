# Feature Notes — cms-profile-sidebar-events

## Entrega realizada

- Criada rota `/cms/dashboard/perfil` com skeleton/loading, MVVM e server actions.
- Adicionados componentes UI locais:
  - `sidebar.tsx`
  - `dropdown-menu.tsx`
  - `avatar.tsx`
  - `progress.tsx`
  - `input-otp.tsx`
- CMS Shell/Sidebar/TopBar migrados para composição de Sidebar Shadcn-like com provider, trigger e sidebar colapsável.
- Menu do usuário passou a ter dropdown com link de perfil, preferências rápidas de tema/fonte e logout.
- Criados hooks globais `useTheme` e `useChangeFont` em `src/hooks` com persistência em LocalStorage.
- Criada UI de perfil com:
  - dados pessoais;
  - upload de avatar para Supabase Storage;
  - preferências de tema/fonte;
  - validação visual de força de senha;
  - OTP component preparado e bloqueio seguro enquanto OTP real não está conectado;
  - modal de zona de perigo sem ação destrutiva real nesta etapa.
- Formulário de edição de evento ajustado para mobile/responsivo.
- Criada migration de referência `src/databases/00004_cms_profile_preferences.sql` para bucket `avatars`, políticas e colunas opcionais de cooldown.

## Validação

- `npm run build` — passou.
- `./node_modules/.bin/biome check <arquivos alterados>` — passou.
- `npm run lint` global — falhou por problemas preexistentes fora do escopo:
  - `.synapos/.manifest.json` possui JSON inválido;
  - `.synapos/open-pr.js` e arquivos antigos de `src/app/(auth)/cadastro` têm erros/avisos Biome.

## Pendências fora do escopo incremental

- Conectar envio/verificação real de OTP por e-mail no Supabase antes de liberar alteração de senha.
- Implementar exclusão definitiva de conta com validação de senha e operação admin segura.
- Aplicar e validar migration em ambiente Supabase.
