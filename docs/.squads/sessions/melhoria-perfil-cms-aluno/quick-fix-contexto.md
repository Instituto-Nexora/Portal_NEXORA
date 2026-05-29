# Quick Fix — Contexto

**Feature:** melhoria-perfil-cms-aluno
**Data:** 2026-05-19
**Pipeline:** quick-fix

## Objetivo
Melhorar os perfis CMS e aluno com foco em reuso, upload otimizado e UX.

## Escopo
1. Identificar componentes duplicados entre CMS e perfil do aluno → extrair para `src/components/`
2. Implementar otimização de imagem client-side antes do upload (redimensionar/comprimir)
3. Criar componente de upload drag-and-drop clicável substituindo o input atual nos dois perfis

## Fora do escopo
Lógica de server actions, autenticação, outros formulários do perfil.

## Risco identificado
Otimização de imagem requer canvas — solução nativa (sem dependência externa) preferencial.
