# Guia Completo: Portal NEXORA

Este guia detalha o passo a passo para configurar, rodar localmente e adicionar novas funcionalidades ao projeto **Portal NEXORA**. O repositório utiliza uma arquitetura moderna baseada em Next.js (App Router), React 19, Tailwind CSS v4 e Supabase.

---

## 1. Visão Geral da Stack Tecnológica

Antes de iniciar, é fundamental compreender as tecnologias e versões críticas utilizadas no projeto, pois elas contêm *breaking changes* em relação a versões anteriores:

- **Framework:** Next.js 16.2.4 (App Router)
- **UI Runtime:** React 19.2.4 (com React Compiler habilitado)
- **Linguagem:** TypeScript (^5)
- **Estilização:** Tailwind CSS v4 + PostCSS
- **Componentes:** Shadcn/UI + Base UI
- **BaaS (Backend as a Service):** Supabase (Autenticação e Banco de Dados PostgreSQL)
- **Linting e Formatação:** Biome (substitui ESLint e Prettier)

> **Aviso Importante:** O projeto não utiliza ESLint ou Prettier. Toda a verificação de código é feita pelo Biome. Além disso, evite otimizações manuais excessivas (`useMemo`, `useCallback`), pois o React Compiler já está ativo.

---

## 2. Como Rodar o Projeto Localmente

### 2.1. Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- **Node.js** (versão 20 ou superior recomendada)
- Um gerenciador de pacotes (`npm`, `yarn`, `pnpm` ou `bun`)
- Conta no **Supabase** (para configurar o banco de dados e autenticação localmente ou usar um projeto de desenvolvimento)

### 2.2. Passo a Passo de Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Instituto-Nexora/Portal_NEXORA.git
   cd Portal_NEXORA
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configuração das Variáveis de Ambiente:**
   Crie um arquivo `.env.local` na raiz do projeto. O sistema de autenticação e o CMS dependem do Supabase para funcionar. Adicione as seguintes variáveis:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_do_supabase
   SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_do_supabase
   ```
   *Nota: A `SUPABASE_SERVICE_ROLE_KEY` é usada apenas no servidor (ex: para criar perfis de usuários no registro) e nunca deve ser exposta ao cliente.*

4. **Configuração do Banco de Dados (Supabase):**
   Para que o CMS funcione corretamente, você precisa criar a tabela `profiles` e configurar o *Row Level Security* (RLS). Execute o seguinte script SQL no SQL Editor do seu projeto Supabase:

   ```sql
   create type public.admin_role as enum ('admin', 'content_creator', 'professor');

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

   alter table public.profiles enable row level security;

   create policy "admins_read_all_profiles" on public.profiles for select
     using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin'));

   create policy "user_read_own_profile" on public.profiles for select
     using (user_id = auth.uid());

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

5. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:3000` para ver o site público e `http://localhost:3000/cms/login` para acessar o painel administrativo.

---

## 3. Como Adicionar Novas Funcionalidades

O projeto segue uma arquitetura rigorosa baseada no padrão **MVVM (Model-View-ViewModel)** para páginas que contêm lógica, estado ou formulários. Isso garante a separação clara entre Server Components e Client Components.

### 3.1. Regras de Ouro da Arquitetura

1. **`page.tsx` é sempre um Server Component:**
   - Nunca utilize `"use client"` no arquivo `page.tsx`.
   - Ele serve apenas como ponto de entrada, podendo fazer *data fetching* assíncrono e passar os dados como *props* para os componentes filhos.

2. **Co-localização em `_features/`:**
   - Toda lógica, estado e UI interativa de uma página deve ser encapsulada dentro de uma pasta `_features/` na mesma rota.

3. **Uso Obrigatório de React Hook Form e Zod:**
   - Qualquer formulário deve ser construído usando `react-hook-form` integrado com validação via `zod`.
   - O gerenciamento de estado manual para inputs (`useState`) é proibido.

### 3.2. Estrutura Padrão de uma Nova Feature

Ao criar uma nova funcionalidade (ex: uma página de "Cursos"), a estrutura de pastas deve ser exatamente esta:

```text
app/(publics)/cursos/
├── page.tsx                           # Server Component (Ponto de entrada)
└── _features/
    └── CursosList/
        ├── index.tsx                  # Re-export público (export { default } from './view')
        ├── view.tsx                   # Client Component (Apenas UI e JSX)
        ├── viewModel.tsx              # Client Component (Custom hook com toda a lógica)
        ├── model.ts                   # Tipos e constantes (Sem lógica)
        └── schema.ts                  # Zod schema (Obrigatório se houver formulário)
```

### 3.3. Exemplo Prático: Criando uma Feature

#### 1. O Ponto de Entrada (`page.tsx`)
```tsx
// app/(publics)/cursos/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import CursosList from "./_features/CursosList";

export const metadata: Metadata = {
  title: "Cursos - NEXORA",
};

export default function CursosPage() {
  return (
    <Suspense fallback={<div>Carregando cursos...</div>}>
      <CursosList />
    </Suspense>
  );
}
```

#### 2. O Schema (`schema.ts`) - *Se houver formulário de busca/filtro*
```typescript
// app/(publics)/cursos/_features/CursosList/schema.ts
import { z } from "zod";

export const buscaCursoSchema = z.object({
  termo: z.string().optional(),
});

export type BuscaCursoForm = z.infer<typeof buscaCursoSchema>;
```

#### 3. O ViewModel (`viewModel.tsx`)
O ViewModel concentra toda a lógica, estado e handlers. Ele deve retornar um tipo explícito.

```tsx
// app/(publics)/cursos/_features/CursosList/viewModel.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { buscaCursoSchema, type BuscaCursoForm } from "./schema";

export type CursosListViewModel = {
  form: UseFormReturn<BuscaCursoForm>;
  cursos: Array<{ id: string; titulo: string }>;
  handleBuscar: (data: BuscaCursoForm) => void;
};

const useCursosListViewModel = (): CursosListViewModel => {
  const form = useForm<BuscaCursoForm>({
    resolver: zodResolver(buscaCursoSchema),
    defaultValues: { termo: "" },
  });

  // Estado simulado ou fetch via SWR/React Query/Server Actions
  const cursos = [
    { id: "1", titulo: "Introdução à Programação" },
    { id: "2", titulo: "Design de Interfaces" },
  ];

  const handleBuscar = (data: BuscaCursoForm) => {
    console.log("Buscando por:", data.termo);
    // Lógica de filtro aqui
  };

  return { form, cursos, handleBuscar };
};

export default useCursosListViewModel;
```

#### 4. A View (`view.tsx`)
A View consome o ViewModel e renderiza a interface usando os componentes do Shadcn/UI.

```tsx
// app/(publics)/cursos/_features/CursosList/view.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useCursosListViewModel from "./viewModel";

export default function CursosList() {
  const { form, cursos, handleBuscar } = useCursosListViewModel();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Nossos Cursos</h1>
      
      <form onSubmit={form.handleSubmit(handleBuscar)} className="flex gap-2 mb-6">
        <Input 
          placeholder="Buscar curso..." 
          {...form.register("termo")} 
        />
        <Button type="submit">Buscar</Button>
      </form>

      <ul className="space-y-2">
        {cursos.map(curso => (
          <li key={curso.id} className="p-4 border rounded-md">
            {curso.titulo}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

#### 5. O Re-export (`index.tsx`)
```tsx
// app/(publics)/cursos/_features/CursosList/index.tsx
export { default } from "./view";
```

---

## 4. Padrões de Código e Ferramentas

### 4.1. Linting e Formatação
Antes de fazer um commit, certifique-se de que o código está no padrão do projeto utilizando o Biome:
```bash
npm run lint      # Verifica erros
npm run format    # Formata e corrige automaticamente
```

### 4.2. Nomenclatura
- **Componentes:** `PascalCase` (ex: `CourseCard.tsx`)
- **Hooks:** `camelCase` com prefixo `use` (ex: `useCourseProgress.ts`)
- **Utilitários:** `camelCase` (ex: `formatPrice.ts`)
- **Tipos:** `PascalCase` (ex: `CourseWithLessons`)

### 4.3. Adicionando Funcionalidades ao CMS
Se a nova funcionalidade for administrativa, ela deve ser criada dentro do *route group* `(cms)`. 
- As rotas do CMS são protegidas pelo `middleware.ts` (Proxy).
- O layout do CMS (`app/(cms)/cms/dashboard/layout.tsx`) valida a sessão do usuário no servidor antes de renderizar a página.
- Siga a mesma estrutura MVVM descrita acima, colocando a nova página dentro de `app/(cms)/cms/dashboard/sua-feature/`.

---

## 5. Resumo do Fluxo de Trabalho

1. **Planejamento:** Identifique se a feature é pública (`(publics)`) ou administrativa (`(cms)`).
2. **Criação da Rota:** Crie o arquivo `page.tsx` (Server Component).
3. **Estruturação MVVM:** Crie a pasta `_features/NomeDaFeature/` com `view.tsx`, `viewModel.tsx`, `schema.ts` e `index.tsx`.
4. **Desenvolvimento:** Implemente a lógica no ViewModel e a interface na View usando componentes de `src/components/ui/`.
5. **Validação:** Rode `npm run format` e `npm run lint`.
6. **Commit:** Siga o padrão de commits semânticos (`feat:`, `fix:`, `chore:`).
