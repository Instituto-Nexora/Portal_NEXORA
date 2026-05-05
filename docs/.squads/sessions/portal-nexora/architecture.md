# Decisão Arquitetural: Identidade Visual + Redesign da Home

**Data:** 2026-05-02
**Agent:** Ana Arquitetura + Úrsula UI
**Squad:** frontend-001

---

## Entendimento da Task

Redesign completo da home page do Portal Nexora como protótipo de identidade visual.
Análise de concorrentes (Udemy, Alura, Hotmart) para extrair melhores práticas de UI/UX.
Foco em posicionamento diferenciado: plataforma educacional de impacto social — nem tão corporativa quanto Udemy, nem tão técnica quanto Alura, mais calorosa que Hotmart.

---

## Análise Competitiva — Insights Extraídos

### Udemy
- **O que funciona:** Paleta neutra (branco/cinza) com accent vibrante que faz o CTA "saltar". Cards com thumbnail, social proof (N alunos). Navbar com busca proeminente.
- **O que evitar:** Densidade visual excessiva, sensação de marketplace genérico sem personalidade.

### Alura
- **O que funciona:** Identidade visual forte (fundo navy escuro + tema "oceânico"). Destaque enorme nos números (2.212 cursos, 120k comunidade). CTAs duplos (explorar + matricular). Seção interativa de carreiras.
- **O que evitar:** Dark background exige muito cuidado de contraste — peso visual alto.

### Hotmart
- **O que funciona:** Social proof com números enormes (50B+ em vendas, 4.6★ com 200k avaliações) **acima do fold**. Gradiente energético. CTA repetido estrategicamente. Espaçamento generoso.
- **O que evitar:** Foco em produtor/vendedor não se aplica ao posicionamento social de NEXORA.

### Síntese — O que NEXORA deve incorporar

| Prática | Origem | Aplicação |
|---|---|---|
| Social proof numérico no hero | Hotmart | Stats (+500 alunos, +30 projetos, +15 parceiros) no próprio hero |
| Accent vibrante em CTAs | Udemy | Amber `#F59E0B` como cor de ação primária |
| Identidade de cor forte e própria | Alura | Deep Teal como primary — diferente dos 3 concorrentes |
| Espaçamento generoso entre seções | Hotmart | `py-20` mínimo, `py-28` no hero |
| Depoimentos com foto + contexto | Alura | Nova seção TestimonialsSection |
| Hero split-layout | Todos | Texto à esquerda, visual/stats à direita (desktop) |

---

## Sistema de Design — Identidade Visual NEXORA

### ADR-VIS-001: Paleta de Cores da Marca

**Contexto:** `globals.css` atual usa tokens Shadcn padrão (preto/branco), sem identidade de marca. Os componentes usam classes Tailwind hardcoded (`blue-900`, `emerald-500`) sem sistema coeso.

**Decisão:** Definir identidade **Deep Teal + Warm Amber** no `globals.css` via CSS custom properties, remapeando os tokens `--primary` e `--accent` do Shadcn.

**Alternativas rejeitadas:**
- Manter `blue-900`/`emerald-500` inline — sem coesão, difícil manutenção e sem diferenciação
- Roxo (Udemy) — já ocupado pelos líderes de mercado
- Laranja (Hotmart) — transmite venda agressiva, não impacto social

**Paleta definida (valores oklch compatíveis com Tailwind v4):**

```
NEXORA Brand Colors
─────────────────────────────────────────────────────────────
Role              Nome           OKLCH aprox.   Hex equiv.
─────────────────────────────────────────────────────────────
--brand-primary   Deep Teal      oklch(0.45 0.12 175)  #0F766E  → confiança+tech+social
--brand-primary-d Dark Teal      oklch(0.38 0.11 175)  #0D5E57  → hover states
--brand-primary-l Light Teal     oklch(0.96 0.04 175)  #CCFBF1  → bg suave, badges
--brand-teal-hero Hero BG Teal   oklch(0.20 0.07 175)  #0D3D37  → hero dark bg
--brand-accent    Warm Amber     oklch(0.75 0.16 85)   #F59E0B  → CTAs, destaques
--brand-accent-d  Deep Amber     oklch(0.65 0.16 85)   #D97706  → hover do CTA
--brand-heading   Slate 900      oklch(0.13 0.02 240)  #0F172A  → headings
--brand-body      Slate 600      oklch(0.42 0.03 240)  #475569  → body text
--brand-bg-alt    Slate 50       oklch(0.98 0.01 240)  #F8FAFC  → fundos alternados
─────────────────────────────────────────────────────────────
```

**Tokens Shadcn remapeados:**
```
--primary              → brand-primary  (teal-700)
--primary-foreground   → white
```

**Consequências:**
✅ Identidade única — Deep Teal não existe nos 3 concorrentes analisados
✅ Teal = saúde + educação + tecnologia na psicologia das cores
✅ Amber = calor, acessibilidade, missão social, otimismo
⚠ `--primary` remapeado afeta todos os componentes Shadcn que usam `bg-primary` — validar CMS após implementação

---

### ADR-VIS-002: Tipografia

**Decisão:** Inter (já carregado pelo sistema/Shadcn) sem adicionar dependência nova.

```
Display (H1):  Inter Black 900,   48–60px desktop / 36px mobile
Heading (H2):  Inter Bold 700,    32–36px
Sub-heading:   Inter SemiBold 600, 20–24px
Body:          Inter Regular 400,  16px, line-height 1.6
Small/Caption: Inter Medium 500,   14px
Badge/Label:   Inter SemiBold 600, 12px, letter-spacing 0.08em, UPPERCASE
```

---

### ADR-VIS-003: Reestruturação das Seções

**Contexto:** Ordem atual não segue boas práticas de landing page de conversão.

**Mudança de ordem:**

```
ANTES                    DEPOIS
──────────────────────   ──────────────────────────────────────
1. HeroSection           1. HeroSection        (split + stats inline)
2. CursosDestaque        2. ImpactoSection     (movida para cima — social proof)
3. ProjetosSociais       3. CursosDestaque     (cards redesenhados)
4. ImpactoSection        4. ProjetosSociais    (nova paleta)
5. ParceirosCTA          5. TestimonialsSection (NOVO — depoimentos)
                         6. ParceirosCTA        (redesign — mais impacto)
```

**Justificativa:** Social proof deve aparecer antes dos cursos. Depoimentos antes do CTA final é prática universal de alta conversão (validado pelos 3 concorrentes).

---

## Estrutura de Componentes

```
src/app/(publics)/(home)/
├── page.tsx                                    ← reordenar + adicionar Testimonials
└── _features/home/
    ├── HeroSection.tsx                         ← redesign: split layout, teal dark bg, amber CTA
    ├── CursosDestaque.tsx                      ← nova paleta, cards sem border-l colorida
    ├── ProjetosSociais.tsx                     ← nova paleta teal/amber
    ├── ImpactoSection.tsx                      ← fundo teal-50 (não dark), stats maiores
    ├── ParceirosCTA.tsx                        ← dark teal bg, amber CTA large
    └── TestimonialsSection.tsx                 ← NOVO: 3 cards de depoimento
```

### Novo type (TestimonialsSection)

```typescript
type Testimonial = {
  id: string
  quote: string
  author: string
  role: string
  avatarInitials: string
}
```

---

## Especificação Visual por Seção (Úrsula UI)

### 1. HeroSection — Split Layout

**Desktop layout:**
```
┌────────────────────────────────────────────────────────────┐
│  bg: teal-900 (#0D3D37)                py-28               │
├────────────────────────────┬───────────────────────────────┤
│ col-span 55%               │ col-span 45%                  │
│                            │                               │
│  [PLATAFORMA EDUCACIONAL]  │   [Ilustração / placeholder   │
│  badge amber-400           │    SVG ou imagem hero]        │
│                            │                               │
│  H1: Tecnologia que        │   ┌───────────────────────┐  │
│  conecta, educa e          │   │  +500    +30    +15   │  │
│  transforma vidas          │   │ Alunos  Proj.  Parc.  │  │
│                            │   └───────────────────────┘  │
│  P: Projetos sociais,      │                               │
│  cursos profission.        │                               │
│  e impacto real.           │                               │
│                            │                               │
│  [Ver Cursos ▶] [Parceiro] │                               │
└────────────────────────────┴───────────────────────────────┘
```

**Estados e especificações:**
- Background: `bg-[var(--brand-teal-hero)]` ou `bg-teal-900`
- Badge: `text-amber-400 text-xs font-semibold tracking-widest uppercase`
- H1: `text-5xl md:text-6xl font-black text-white leading-[1.1]`
- Subtitle: `text-teal-200 text-lg leading-relaxed`
- CTA primário: `bg-amber-500 hover:bg-amber-400 text-teal-900 font-bold h-11 px-7 transition-colors`
- CTA secundário: `border border-teal-600 text-white hover:bg-teal-800 h-11 px-7 transition-colors`
- Stats — número: `text-amber-400 text-4xl font-black`
- Stats — label: `text-teal-300 text-xs font-medium`
- Divisores stats: `border-r border-teal-700`
- Mobile: single column, visual oculto (`hidden md:block`)

**Acessibilidade:**
- `aria-labelledby="hero-title"` mantido
- Contraste H1 (white over teal-900): > 10:1 ✅
- Contraste amber-400 over teal-900: ~4.7:1 ✅ AA

---

### 2. ImpactoSection — Fundo Claro

**Especificações:**
- Background: `bg-teal-50` (não dark como antes)
- Número: `text-6xl font-black text-teal-700`
- Label: `text-slate-600 text-sm font-medium mt-1`
- Divisores: `border-r border-teal-200`
- Padding: `py-16`

---

### 3. CursosDestaque — Cards Redesenhados

**Cards:**
- Remover `border-l-4 border-l-emerald-500`
- Adicionar `border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1`
- Tag de categoria: `bg-teal-100 text-teal-700 border-0`
- Title: `text-slate-900 font-semibold`
- CTA card: `bg-teal-700 hover:bg-teal-600 text-white w-full` (teal, não emerald)
- Background seção: `bg-slate-50`

---

### 4. ProjetosSociais — Nova Paleta

- Background: `bg-white`
- Border card: `border-l-4 border-l-teal-600` (manter padrão lateral, trocar cor)
- Icon container: `bg-teal-100` → ícone `text-teal-600`
- Title cards: `text-slate-900`

---

### 5. TestimonialsSection — Novo Componente

**Layout:**
```
┌────────────────────────────────────────────────────────────┐
│  bg-white    "O que nossos alunos dizem"   py-20           │
│  ┌──────────────────┐ ┌──────────────────┐ ┌─────────────┐│
│  │ ★★★★★            │ │ ★★★★★            │ │ ★★★★★       ││
│  │ "Quote do aluno  │ │ "Quote do aluno  │ │ "Quote..."  ││
│  │  em itálico"     │ │  em itálico"     │ │             ││
│  │                  │ │                  │ │             ││
│  │ [AB] Nome        │ │ [CD] Nome        │ │ [EF] Nome   ││
│  │ Curso cursado    │ │ Curso cursado    │ │ Curso       ││
│  └──────────────────┘ └──────────────────┘ └─────────────┘│
└────────────────────────────────────────────────────────────┘
```

**Especificações:**
- Background seção: `bg-white`
- Cards: `bg-slate-50 border border-slate-200 rounded-xl p-6`
- Stars: `text-amber-400` (5 ícones `Star` do lucide, `fill-amber-400`)
- Quote: `text-slate-700 italic text-base leading-relaxed`
- Avatar: `size-10 rounded-full bg-teal-700 text-white flex items-center justify-center text-sm font-bold`
- Author name: `text-slate-900 font-semibold text-sm`
- Role: `text-teal-600 text-xs`

**Acessibilidade:**
- Contraste quote (slate-700 over slate-50): ~6.7:1 ✅ AA
- Avatar é decorativo — `aria-hidden="true"` no div

---

### 6. ParceirosCTA — Dark e Imponente

**Especificações:**
- Background: `bg-teal-900` com subtle dot pattern via `bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_1px,_transparent_1px)] [background-size:24px_24px]`
- Título: `text-white text-4xl font-black`
- Subtitle: `text-teal-200 text-lg`
- CTA: `bg-amber-500 hover:bg-amber-400 text-teal-900 font-bold h-14 px-10 text-lg transition-colors`
- Padding: `py-28`

---

## Tokens CSS a adicionar em globals.css

```css
/* Adicionar no :root — Brand NEXORA */
--brand-primary: oklch(0.45 0.12 175);
--brand-primary-dark: oklch(0.38 0.11 175);
--brand-primary-light: oklch(0.96 0.04 175);
--brand-teal-hero: oklch(0.20 0.07 175);
--brand-accent: oklch(0.75 0.16 85);
--brand-accent-dark: oklch(0.65 0.16 85);
--brand-heading: oklch(0.13 0.02 240);
--brand-body: oklch(0.42 0.03 240);
--brand-bg-alt: oklch(0.98 0.01 240);

/* Remapear Shadcn para brand */
--primary: var(--brand-primary);
--primary-foreground: oklch(1 0 0);
```

---

## Decisões de Estado

| Estado | Tipo | Componente | Justificativa |
|---|---|---|---|
| testimonials | prop estática | TestimonialsSection | Dados hardcoded no page.tsx — MVP, sem fetch |
| cursos | prop estática | CursosDestaque | Já é estático — manter |
| projetos | prop estática | ProjetosSociais | Já é estático — manter |
| impacto items | prop estática | ImpactoSection | Já é estático — manter |

> Nenhum estado reativo — page.tsx permanece Server Component puro, sem hooks. ✅ ADR-004.

---

## ADR Compliance

- [RESPEITADA] ADR-001: App Router — page.tsx Server Component, sem 'use client'
- [RESPEITADA] ADR-003: Tailwind v4 — tokens via `@theme` em globals.css, sem tailwind.config.js
- [RESPEITADA] ADR-004: MVVM — sem lógica nos Server Components (dados como props)
- [RESPEITADA] ADR-005: Type-only — todos os novos types usarão `type`, não `interface`
- [RESPEITADA] ADR-006: Utils reutilizáveis — sem lógica duplicada
- [RESPEITADA] ADR-007: cn() obrigatório em todos os className JSX
- [NÃO APLICÁVEL] ADR-002: Supabase — home pública não tem integração com banco

---

## Arquivos a Modificar / Criar

```
MODIFICAR:
- src/components/layout/globals.css
- src/app/(publics)/(home)/page.tsx
- src/app/(publics)/(home)/_features/home/HeroSection.tsx
- src/app/(publics)/(home)/_features/home/CursosDestaque.tsx
- src/app/(publics)/(home)/_features/home/ProjetosSociais.tsx
- src/app/(publics)/(home)/_features/home/ImpactoSection.tsx
- src/app/(publics)/(home)/_features/home/ParceirosCTA.tsx

CRIAR:
- src/app/(publics)/(home)/_features/home/TestimonialsSection.tsx
```

---

## Pontos de Atenção para o Dev (Rodrigo React)

1. **CSS tokens OKLCH:** globals.css usa `oklch()` — todos os tokens novos devem seguir o mesmo formato. Não misturar hex diretamente.
2. **Tailwind v4 com CSS vars:** para usar as vars como utilities Tailwind, adicionar ao `@theme inline` em globals.css (ex: `--color-brand-primary: var(--brand-primary)`). Se não, usar `bg-[var(--brand-primary)]`.
3. **TestimonialsSection é estático:** dados mocados no page.tsx com 3 depoimentos placeholder de qualidade realista.
4. **HeroSection split:** usar `grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12` — decisão de implementação do Rodrigo, mas o resultado deve ser split em desktop, stack em mobile.
5. **Avatar initials:** `avatarInitials` é 2 chars (ex: "MS") — não usar `<img>` sem src válido.
6. **`Button render` prop:** padrão deste projeto é `render={<Link href="..." />}` no Shadcn Button (Next.js 16 — ver CursosDestaque.tsx existente).
7. **`--primary` remapeado:** verificar que o CMS ainda funciona visualmente após a mudança. O dark teal é mais escuro que o preto padrão — pode afetar sidebar do CMS.
8. **`npm run build` obrigatório** ao final — zero erros TypeScript.
