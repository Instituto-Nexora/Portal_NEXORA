# ADR-009: Shadcn/UI First — HTML nativo apenas como fallback

**Status:** Aceita
**Data:** 2026-05-29
**Deciders:** Tech Lead

---

## Contexto

O projeto usa Shadcn/UI como biblioteca de componentes. Em revisões de código foram encontrados elementos HTML nativos (`<button>`, `<input>`, `<textarea>`, `<select>`, `<a>`, `<label>`) sendo usados diretamente mesmo quando existia um componente Shadcn equivalente disponível. Isso gera inconsistência visual, duplicação de estilos e ignora acessibilidade já tratada nos componentes da biblioteca.

---

## Decisão

**Shadcn/UI é obrigatório quando o componente existir.**

HTML nativo só é permitido quando não houver componente Shadcn equivalente ou quando o Shadcn não atender ao requisito técnico específico.

### Mapeamento obrigatório

| HTML nativo | Componente Shadcn obrigatório |
|---|---|
| `<button>` | `<Button>` |
| `<input>` | `<Input>` |
| `<textarea>` | `<Textarea>` |
| `<select>` + `<option>` | `<Select>` + `<SelectItem>` |
| `<a>` (navegação interna) | `<Link>` (Next.js) + `<Button variant="link">` se estilizado como botão |
| `<label>` | `<Label>` |
| `<dialog>` | `<Dialog>` |
| `<form>` | `<form>` nativo é aceito — React Hook Form integra com HTML `<form>` |
| Tabelas | `<Table>`, `<TableRow>`, `<TableCell>` |
| Cards | `<Card>`, `<CardHeader>`, `<CardContent>` |
| Badges | `<Badge>` |
| Separadores | `<Separator>` |
| Toasts | `<toast>` via Sonner (`useToast`) |
| Tooltips | `<Tooltip>`, `<TooltipContent>` |
| Dropdowns | `<DropdownMenu>` |

### Quando HTML nativo é permitido

- O componente Shadcn não existe no projeto (verificar `src/components/ui/`)
- O caso de uso é estrutural/semântico sem estilo visível (`<main>`, `<section>`, `<article>`, `<header>`, `<footer>`, `<nav>`, `<h1>`–`<h6>`, `<p>`, `<span>`, `<div>`)
- O componente Shadcn adiciona comportamento indesejado que não pode ser contornado

### Verificação antes de escrever

Antes de usar qualquer elemento interativo em HTML nativo:
1. Consultar `src/components/ui/` para verificar se o componente existe
2. Se não existir: instalar via `npx shadcn@latest add <component>` e documentar no PR

---

## Consequências

- **Positivo:** Consistência visual garantida, acessibilidade herdada, estilos centralizados em `globals.css` e nos componentes Shadcn
- **Positivo:** Reduz CSS inline e classes utilitárias desnecessárias em elementos que já teriam estilo via componente
- **Negativo:** Requer verificar o catálogo Shadcn antes de codar — overhead mínimo, aceito
- **Atenção:** `<textarea>` e `<select>` nativo ainda são aceitos dentro de `react-hook-form` via `register()` quando o componente Shadcn correspondente não suporta integração direta com RHF sem wrapper — documentar no PR se for o caso
