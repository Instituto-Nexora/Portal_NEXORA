# Quick Fix — Contexto

**Feature:** issue-92-admin-cms-conta-cooldown
**Data:** 2026-05-24
**Pipeline:** quick-fix
**Issue:** #92 — Admin(CMS): Consertando opção de exclusão de conta e cooldown

## Objetivo
Remover a opção de exclusão de conta do perfil CMS e substituir o cooldown rígido por limite de até 5 alterações por dia, com modal de aviso quando o limite diário for alcançado.

## Escopo
1. Remover a UI de “Zona de perigo” / “Excluir conta” da tela de perfil do CMS.
2. Trocar a regra de cooldown por histórico diário de alterações no fluxo atual do perfil CMS.
3. Exibir feedback em modal quando o limite diário de alterações for atingido.
4. Atualizar textos da UI para comunicar o limite de 5 alterações por dia.

## Fora do escopo
Implementar exclusão real de conta, alterar OTP real por e-mail, criar migrations ou mudar políticas Supabase.

## Risco identificado
O fluxo atual usa `user_metadata` do Supabase Auth para controle de alteração; a solução deve preservar essa abordagem para não introduzir arquitetura nova nesta correção.
