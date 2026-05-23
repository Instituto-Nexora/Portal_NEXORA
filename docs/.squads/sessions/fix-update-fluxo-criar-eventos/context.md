# Contexto: fix-update-fluxo-criar-eventos

> Arquivo central da feature. Lido por todos os roles antes de executar qualquer step.
> Atualizado pelo role que fizer discovery/investigação.

## O que é
Player de vídeo para aulas na área do aluno. O aluno assiste à aula e acessa materiais complementares.

**Rota:** `src/app/(publics)/minha-area/cursos/[cursoId]/aulas/[aulaId]/page.tsx`

**Estrutura:**
```
src/app/(publics)/minha-area/cursos/[cursoId]/aulas/[aulaId]/
├── page.tsx                     ← Server Component: busca dados da aula + verifica matrícula
└── _features/PlayerAula/
    ├── view.tsx                 ← Player + sidebar de aulas
    ├── viewModel.tsx            ← progresso, navegação entre aulas
    └── actions.ts               ← marcar aula como concluída
```

## Por que existe
O Portal Nexora oferece cursos com aulas gravadas. O aluno precisa de uma interface para assistir às aulas, acompanhar seu progresso e navegar entre as aulas do curso.

## Comportamento
1. `page.tsx` (Server Component) verifica se o aluno está matriculado no curso
   - Não matriculado → redirect para `/vendas`
   - Matriculado → renderiza o player
2. Player exibe o vídeo (embed YouTube/Vimeo via `<iframe>`)
3. Sidebar lista todas as aulas do curso com indicador de progresso (✓ concluída)
4. Botão "Marcar como concluída" → Server Action registra em `lesson_progress`
5. Após marcar: destaca a aula seguinte e atualiza a sidebar

## Embed de vídeo
```tsx
<iframe
  src={`https://www.youtube.com/embed/${videoId}`}
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  className={cn("w-full aspect-video rounded-lg")}
  title={aula.title}
/>
```

## Regras técnicas
- `page.tsx` é Server Component com async/await para buscar dados
- Rota protegida (aluno autenticado + matriculado)
- `viewModel.tsx` com "use client" controla estado de UI (aula ativa, progresso local)
- Server Action `marcarConcluida(aulaId)` usa o client de usuário (`createClient()`)
- `cn()` + type (ADRs 007, 005)

## Critérios de aceite
- [ ] Aluno não matriculado é redirecionado para `/vendas`
- [ ] Vídeo carrega corretamente (embed do YouTube/Vimeo)
- [ ] Sidebar lista aulas com indicador de progresso
- [ ] "Marcar como concluída" registra em `lesson_progress`
- [ ] `npm run build` sem erros

## Decisões tomadas
- Padrão MVVM com pasta `_features/<NomeFeature>/` contendo view.tsx, viewModel.tsx, actions.ts
- Server Components para páginas; Client Components com interatividade
- Zod para validação (se aplicável)

## O que não fazer
- Não implementar player customizado (usar embed YouTube/Vimeo por enquanto)
- Não implementar sistema de notas ou quizzes nesta feature
- Não implementar download de vídeos
