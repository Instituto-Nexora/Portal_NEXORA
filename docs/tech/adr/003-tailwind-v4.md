# ADR 003 — Tailwind CSS v4

**Data:** 2026-04-25  
**Status:** Aceita  
**Validado por:** fundador

---

## Contexto

Tailwind v4 foi lançado com breaking changes significativos em relação ao v3. O projeto iniciou diretamente na v4.

---

## Decisão

Usar **Tailwind CSS v4** desde o início do projeto, sem compatibilidade com v3.

---

## Diferenças Críticas em Relação ao v3

| Aspecto | v3 | v4 |
|---|---|---|
| Configuração | `tailwind.config.js` | CSS nativo em `globals.css` |
| PostCSS plugin | `tailwindcss` | `@tailwindcss/postcss` |
| Temas customizados | `theme.extend` no config | `@theme` no CSS |
| Prefix de utilities | Classes fixas | Pode gerar sob demanda |

---

## Consequências

**Positivas:**
- Configuração mais simples via CSS puro
- Performance de build melhorada
- Melhor integração com design tokens nativos do CSS

**Negativas / Atenção:**
- Plugins do Tailwind v3 podem não ser compatíveis — verificar antes de instalar
- Documentação online ainda mistura v3 e v4 — sempre verificar a versão da doc
- `tailwind.config.js` **não é usado** neste projeto — não criar

---

## Referência

- Docs v4: https://tailwindcss.com/docs (verificar versão selecionada na UI)
- Configuração atual: [src/app/globals.css](../../src/app/globals.css)
