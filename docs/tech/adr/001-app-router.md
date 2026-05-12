# ADR 001 — Next.js App Router

**Data:** 2026-04-25  
**Status:** Aceita  
**Validado por:** fundador

---

## Contexto

O projeto precisava escolher entre o Pages Router (modelo legado do Next.js) e o App Router (modelo atual, introduzido no Next.js 13+).

---

## Decisão

Adotar o **App Router** como padrão de roteamento e renderização.

---

## Consequências

**Positivas:**
- Server Components por padrão — menos JavaScript enviado ao cliente
- Layouts aninhados nativos — melhor organização de UI
- Streaming e Suspense integrados — melhor UX de carregamento
- Suporte nativo a React 19 e React Compiler
- Alinhamento com a direção do ecossistema Next.js

**Negativas / Atenção:**
- Breaking changes em relação ao Pages Router — não misturar os dois padrões
- Mais complexo para quem vem do Pages Router
- Documentação de terceiros pode referenciar Pages Router — verificar sempre

---

## Referência

- Documentação atual: `node_modules/next/dist/docs/`
- Next.js 16 tem breaking changes em relação ao Next.js 15 — ler release notes antes de atualizar
