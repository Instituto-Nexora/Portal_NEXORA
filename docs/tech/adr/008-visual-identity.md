# ADR-008: Sistema de Identidade Visual — Deep Teal + Amber

**Status:** Aceita
**Data:** 2026-05-02
**Deciders:** Tech Lead / Fundador

---

## Contexto

O projeto iniciou com classes Tailwind hardcoded (`blue-900`, `emerald-500`) sem um sistema de design coeso. Após análise competitiva de Udemy, Alura e Hotmart, ficou evidente a necessidade de uma identidade visual própria que:

- Diferenciasse o NEXORA dos três concorrentes (todos usam azul ou laranja)
- Comunicasse os valores de confiança, tecnologia e impacto social
- Fosse implementável via CSS custom properties no padrão Tailwind v4

---

## Decisão

Adotar a paleta **Deep Teal + Warm Amber** como identidade visual oficial do Portal Nexora, definida via CSS custom properties em `src/components/layout/globals.css`.

---

## Paleta de Cores

### Tokens CSS (definidos em `:root` no `globals.css`)

| Token | Valor OKLCH | Hex equiv. | Uso |
|---|---|---|---|
| `--brand-primary` | `oklch(0.45 0.12 175)` | `#0F766E` | Primary — botões, ícones, bordas |
| `--brand-primary-dark` | `oklch(0.38 0.11 175)` | `#0D5E57` | Hover states do primary |
| `--brand-primary-light` | `oklch(0.96 0.04 175)` | `#CCFBF1` | Backgrounds suaves, badges |
| `--brand-teal-hero` | `oklch(0.20 0.07 175)` | `#0D3D37` | Background hero/header/footer |
| `--brand-accent` | `oklch(0.75 0.16 85)` | `#F59E0B` | CTAs primários, stats, stars |
| `--brand-accent-dark` | `oklch(0.65 0.16 85)` | `#D97706` | Hover dos CTAs accent |
| `--brand-heading` | `oklch(0.13 0.02 240)` | `#0F172A` | Headings em fundo claro |
| `--brand-body` | `oklch(0.42 0.03 240)` | `#475569` | Body text em fundo claro |
| `--brand-bg-alt` | `oklch(0.98 0.01 240)` | `#F8FAFC` | Fundos alternados de seção |

### Mapeamento Shadcn

O token `--primary` do Shadcn é remapeado para `var(--brand-primary)`, o que propaga a cor teal para todos os componentes Shadcn que usam `bg-primary`, `text-primary`, `border-primary`, etc.

```css
--primary: var(--brand-primary);
--primary-foreground: oklch(1 0 0); /* white */
```

---

## Regras de Uso

### CTAs e ações primárias
```tsx
// CTA principal (hero, seções de conversão)
className={cn("bg-amber-500 hover:bg-amber-400 text-teal-900 font-bold")}

// CTA secundário (links de navegação)
className={cn("border border-teal-600 text-white hover:bg-teal-800")}

// Botão de item (cards de cursos, listagens)
className={cn("bg-teal-700 hover:bg-teal-600 text-white")}
```

### Backgrounds de seção
```
teal-900  → Header, Footer, Hero, ParceirosCTA (dark)
teal-50   → ImpactoSection (light teal)
slate-50  → CursosDestaque, seções alternadas
white     → ProjetosSociais, TestimonialsSection, conteúdo principal
```

### Badges e labels
```tsx
className={cn("bg-teal-100 text-teal-700 border-0")}
```

### Textos em fundos claros
```
text-slate-900  → headings (H1, H2)
text-slate-600  → body, descriptions
text-teal-600   → subtítulos coloridos, roles
text-amber-400  → badges de destaque no header/hero
```

### Textos em fundos escuros (teal-900)
```
text-white      → headings
text-teal-100   → nav links, subtítulos
text-teal-200   → descrições, subtítulos secundários
text-teal-300   → links do footer, captions
text-teal-400   → copyright, textos de menor hierarquia
text-amber-400  → badges, stats em destaque
```

---

## Tipografia

Inter (sistema — sem dependência adicional).

| Role | Tailwind | Uso |
|---|---|---|
| Display | `font-black text-5xl md:text-6xl` | H1 do hero |
| Heading | `font-bold text-3xl` | H2 das seções |
| Sub-heading | `font-semibold text-xl` | Títulos de cards |
| Body | `text-base leading-relaxed` | Parágrafos |
| Label | `font-semibold text-xs tracking-widest uppercase` | Badges, eyebrow labels |

---

## Análise Competitiva que Embasou a Decisão

| Plataforma | Cor principal | Por que não seguir |
|---|---|---|
| Udemy | Roxo `#A435F0` | Já ocupado pelo líder global |
| Alura | Azul navy `#1C1C2E` | Muito técnico, pouco acolhedor |
| Hotmart | Laranja/coral `#F85F35` | Transmite venda agressiva |
| **NEXORA** | **Deep Teal `#0F766E`** | Único entre os concorrentes; teal = confiança + saúde + educação |

---

## Consequências

### Positivas ✅
- Identidade visual única e diferenciada nos três concorrentes analisados
- Teal é associado a confiança, saúde e educação na psicologia das cores
- Amber transmite calor, acessibilidade e otimismo — reforça a missão social
- Sistema de tokens em CSS permite mudança global de cor sem alterar componentes
- `--primary` remapeado propaga a identidade para todo o Shadcn automaticamente

### Negativas / Atenção ⚠
- `--primary` remapeado afeta **todos** os componentes Shadcn — incluindo o CMS. Validar visualmente o CMS após qualquer alteração na paleta.
- SVG placeholder do hero usa hex `#5EEAD4` hardcoded nos atributos SVG (não segue o sistema de tokens). A tratar quando o asset final for disponibilizado.
- Os valores `heroStats` e `impactoItems` em `page.tsx` duplicam dados — unificar quando vier do Supabase.

---

## Arquivos Afetados

| Arquivo | Mudança |
|---|---|
| `src/components/layout/globals.css` | Brand tokens + `--primary` remapeado |
| `src/components/layout/Header/Header.tsx` | `blue-900` → `teal-900`, `emerald-500` → `amber-500` |
| `src/components/layout/Footer/Footer.tsx` | `blue-*` → `teal-*` |
| `src/app/(publics)/(home)/_features/home/*.tsx` | Nova paleta teal/amber em todas as seções |
| `src/app/(publics)/(home)/_features/home/TestimonialsSection.tsx` | Novo componente com paleta teal/amber |

---

## Referências

- [ADR-003: Tailwind CSS v4](003-tailwind-v4.md) — configuração via CSS, sem `tailwind.config.js`
- [ADR-007: cn() para className](007-cn-classname-utility.md) — todas as classes passam por `cn()`
