# CMS — Arquitetura de Domínios e Proteção

**Data:** 2026-04-30
**Status:** Aprovado
**Versão:** 1.0

---

## Visão Geral

O CMS do Portal Nexora roda em domínio separado do site público para garantir segurança do `SUPABASE_SERVICE_ROLE_KEY` e isolamento de acessos.

---

## Arquitetura de Domínios

### Deploy

```
MESMO REPOSITÓRIO (Instituto-Nexora/Portal_NEXORA)
├── Projeto 1: portal-nexora          → nexora.com
├── Projeto 2: portal-nexora-cms     → admin.nexora.com
└── Código: mesmo root (./), mesma branch
```

### Environment Variables por Projeto

| Variável | Portal (nexora.com) | CMS (admin.nexora.com) |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ | ✅ |

### Rotas por Domínio

**nexora.com** (público)
```
/               → Landing page
/eventos        → Lista de eventos
/vendas         → Página de vendas
/cms/*          → BLOQUEADO (redirect para /)
```

**admin.nexora.com** (CMS)
```
/cms/login      → Página de login (público)
/cms/register   → Página de cadastro (público)
/cms/dashboard  → Protegido (requer auth)
/cms/contents   → Protegido (requer auth)
```

---

## Proteção de Rotas

### Camadas de Segurança

```
REQUEST
  ↓
┌─────────────────────────────────────┐
│ Camada 1: Proxy (middleware/proxy.ts)│
│ - Verifica hostname → bloqueia público│
│ - Verifica cookie de sessão           │
│ - Rate limiting (20 req/min por IP)   │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ Camada 2: Layout (dashboard/layout)  │
│ - supabase.auth.getUser()            │
│ - Busca profile em admin_profiles    │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ Camada 3: Database (RLS Supabase)     │
│ - Row Level Security no PostgreSQL   │
│ - Usuário só lê/escreve seus dados   │
└─────────────────────────────────────┘
```

### Implementação do Hostname Check

Arquivo: `src/proxy.ts`

```typescript
import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PUBLIC_HOSTNAME = 'nexora.com'
const CMS_PATHS = ['/cms/login', '/cms/register']

export async function proxy(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl

  // Bloquear acesso ao CMS pelo domínio público
  if (hostname === PUBLIC_HOSTNAME && pathname.startsWith('/cms')) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  }

  // Paths públicos do CMS (login/register) — permitir
  if (CMS_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Verificar sessão para paths protegidos
  const { supabaseResponse, user } = await updateSession(request)

  if (!user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/cms/login'
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/cms/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

---

## Rate Limiting

Implementação básica em memória (para produção, usar Redis/Upstash):

```typescript
// src/lib/security/rate-limit.ts
const rateLimitMap = new Map<string, { count: number; last: number }>()
const LIMIT = 20
const WINDOW = 60 * 1000 // 1 minuto

export function rateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now - record.last > WINDOW) {
    rateLimitMap.set(ip, { count: 1, last: now })
    return { allowed: true, remaining: LIMIT - 1 }
  }

  if (record.count >= LIMIT) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: LIMIT - record.count }
}
```

---

## Headers de Segurança

Arquivo: `src/lib/security/headers.ts`

```typescript
import type { NextResponse } from 'next/server'

export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  return response
}
```

---

## RLS — Row Level Security (Supabase)

```sql
-- Tabela admin_profiles com RLS
create table public.admin_profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  full_name   text not null,
  role        text not null default 'content_creator',
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint admin_profiles_user_id_unique unique (user_id)
);

-- Habilitar RLS
alter table public.admin_profiles enable row level security;

-- Policy: usuário lê apenas seu próprio profile
create policy "read_own_profile"
  on public.admin_profiles
  for select
  using (auth.uid() = user_id);

-- Policy: admins podem ler todos os profiles
create policy "admin_read_all"
  on public.admin_profiles
  for select
  using (
    exists (
      select 1 from public.admin_profiles
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- Policy: qualquer usuário cria seu próprio profile no signup
create policy "insert_own_profile"
  on public.admin_profiles
  for insert
  with check (auth.uid() = user_id);

-- Policy: admins podem atualizar qualquer profile
create policy "admin_update_all"
  on public.admin_profiles
  for update
  using (
    exists (
      select 1 from public.admin_profiles
      where user_id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.admin_profiles
      where user_id = auth.uid() and role = 'admin'
    )
  );
```

---

## Checklist de Verificação

```
ANTES DO DEPLOY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Dois projetos Vercel criados
[ ] admin.nexora.com apontado no projeto CMS
[ ] SUPABASE_SERVICE_ROLE_KEY adicionado no projeto CMS
[ ] hostname check implementado no proxy.ts
[ ] Tabela admin_profiles criada com RLS
[ ] Headers de segurança adicionados
[ ] Rate limiting configurado
[ ] Teste: nexora.com/cms/login → redirect para /
[ ] Teste: admin.nexora.com/cms/login → funciona
[ ] Teste: admin.nexora.com/cms/dashboard (sem login) → redirect para /cms/login
```

---

## Histórico

| Data | Alteração |
|---|---|
| 2026-04-30 | Documento criado — arquitetura de domínios e proteção CMS |