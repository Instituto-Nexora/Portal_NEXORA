# Contexto: issue-92-admin-cms-conta-cooldown

> Arquivo central da feature. Lido por todos os roles antes de executar qualquer step.
> Atualizado pelo role que fizer discovery/investigação.

## O que é
Correção da issue #92 do GitHub para o perfil do Admin/CMS: remover a opção de exclusão da própria conta e substituir o cooldown rígido de alterações por limite diário.

## Por que existe
Evitar exclusões acidentais de contas administrativas e reduzir fricção no perfil CMS, permitindo até 5 alterações por dia em dados/foto/senha e avisando quando o limite diário for alcançado.

## Decisões tomadas
- Manter a execução interrompida `melhoria-perfil-cms-aluno` em estado running, sem descartá-la.
- Usar o role frontend existente `frontend-001` em pipeline quick-fix.
- Issue de origem: https://github.com/Instituto-Nexora/Portal_NEXORA/issues/92

## O que não fazer
- Não implementar exclusão de conta.
- Não alterar autenticação, OTP real ou regras de banco além do necessário para esta correção de UI/fluxo atual.
