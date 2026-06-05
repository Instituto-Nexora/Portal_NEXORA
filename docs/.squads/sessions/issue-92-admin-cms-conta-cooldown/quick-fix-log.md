# Quick Fix Log
Data: 2026-05-24
Objetivo: Remover exclusão de conta no CMS e substituir cooldown por limite diário.

O que foi feito: A tela de perfil Admin/CMS não exibe mais a opção de excluir a própria conta. O cooldown rígido foi trocado por limite de 5 alterações nas últimas 24 horas, com modal de aviso quando o limite é atingido.

Decisão técnica: Reutilizar `user_metadata` do Supabase Auth, que já era o mecanismo existente do fluxo, evitando mudança arquitetural em uma correção rápida.

Impacto: Afeta a rota `/cms/dashboard/perfil`, especialmente atualização de dados pessoais, foto de perfil e preparação do fluxo de senha.


Complemento: Implementado crop de avatar com canvas nativo, fallback visual por iniciais e destaque de borda/ring para o avatar em dropdown/sidebar. O lint do código-fonte foi normalizado e o Biome agora ignora artefatos gerados do Synapos.
