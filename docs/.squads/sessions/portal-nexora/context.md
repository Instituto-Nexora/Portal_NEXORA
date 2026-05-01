# Contexto — portal-nexora

**Projeto:** Portal Nexora
**Descrição:** Plataforma Educacional e Serviços de TI com Impacto Social
**Squad:** frontend-001
**Criado em:** 2026-04-25

## O que é
Migração das páginas estáticas legadas (index.html e eventos.html + assets/css e assets/js) para o stack atual do Portal Nexora: Next.js 16 App Router, React 19, Tailwind CSS v4 e Shadcn/UI.

## Por que existe
O projeto iniciou com protótipos HTML estáticos. A migração garante que todo o conteúdo e estilização fiquem dentro do ecossistema Next.js, eliminando arquivos HTML/CSS/JS avulsos da raiz do repositório.

## Decisões

(a ser preenchido durante execução do pipeline)

---

## Sessão 2026-04-30 — CMS: Cadastro de Administradores

### O que é
Formulário de cadastro de novos administradores no CMS do Portal Nexora, seguindo os ADRs do projeto (MVVM em `_features/`, RHF + Zod, type-only, cn()).

### Por que existe
O CMS já possui login e dashboard para admins existentes, mas não há fluxo para criar novos administradores a partir da interface. O cadastro deve integrar com Supabase Auth e inserir o profile na tabela `admin_profiles` com o role adequado.

---

## Sessão 2026-04-30 — CMS Admin

### O que é
Fluxo de CMS (Content Management System) para o Portal Nexora: página de login split-layout, logout, cadastro de admin, sidebar/navbar, e conexão com Supabase Auth.

### Por que existe
O CMS será acessado por admins, criadores de conteúdo e professores. Precisa de autenticação robusta com controle de roles e uma interface administrativa isolada das páginas públicas.

### Roles de usuário
- `admin` — acesso total
- `content_creator` — criação e edição de conteúdo
- `professor` — gestão de cursos e aulas próprias
