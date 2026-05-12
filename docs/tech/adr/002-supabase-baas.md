# ADR 002 — Supabase como BaaS

**Data:** 2026-04-25  
**Status:** Aceita  
**Validado por:** fundador

---

## Contexto

O projeto precisava de banco de dados e autenticação. As opções consideradas incluíam construir uma API customizada com banco próprio ou usar um Backend-as-a-Service.

---

## Decisão

Adotar **Supabase** como BaaS (Backend-as-a-Service), cobrindo:
- PostgreSQL gerenciado
- Autenticação (email/senha, OAuth)
- Row Level Security (RLS) para controle de acesso
- Storage (se necessário para uploads)
- Realtime (disponível, não planejado no MVP)

---

## Consequências

**Positivas:**
- PostgreSQL completo — sem limitações de schema
- Auth pronto — sem implementar autenticação do zero
- RLS no banco — segurança de acesso por linha de dado
- SDK TypeScript com tipos gerados automaticamente
- Tier gratuito generoso para MVP

**Negativas / Atenção:**
- Dependência de serviço externo — lock-in no Supabase
- RLS mal configurado pode expor dados — testar rigorosamente
- Service Role Key nunca deve ir ao cliente — apenas `ANON_KEY` é pública

---

## Integrações Necessárias

- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` — cliente browser
- `SUPABASE_SERVICE_ROLE_KEY` — apenas no servidor (Route Handlers / Server Actions)
