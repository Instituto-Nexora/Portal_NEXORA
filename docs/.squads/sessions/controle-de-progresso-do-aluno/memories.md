# Memória: controle-de-progresso-do-aluno

> Aprendizados acumulados nesta feature.

<!-- RECENTES -->
## Sessão 2026-06-05
Task: Issue #22 — calcularProgressoCurso, Server Actions, Progress Shadcn em minha-area

## Padrões aprovados — 2026-06-05

`ProgressResult` usa nomenclatura pt-BR: `{ concluidas, total, percentual }` — alinhado com `EnrollmentComProgresso` de `CursoCard.tsx`.

`Button` com link em Base UI: `nativeButton={false}` + `render={<Link href="..." />}` — sem `asChild` (padrão Radix, não disponível neste projeto).

Progress bar com paleta teal: `className="h-2 bg-teal-100"` + `indicatorClassName="bg-teal-700"` para parcial, `"bg-teal-500"` para 100%.
<!-- /RECENTES -->
