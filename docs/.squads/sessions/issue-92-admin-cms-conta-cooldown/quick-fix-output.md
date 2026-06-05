# Quick Fix Output — Frontend
Data: 2026-05-24
Objetivo: Corrigir issue #92 no perfil Admin/CMS.

## Implementação
- Removida a seção “Zona de perigo” com a ação de excluir conta da tela de perfil CMS.
- Substituído o cooldown rígido de 2 horas por controle de até 5 alterações nas últimas 24 horas usando o `user_metadata` já utilizado pelo fluxo atual.
- Adicionado modal de erro/aviso quando o limite diário é alcançado, com data/hora estimada para nova tentativa.
- Atualizados textos da UI para comunicar o limite diário de alterações.

## Arquivos modificados
- `src/app/(cms)/cms/dashboard/perfil/_features/Perfil/actions.ts`: troca do cooldown por histórico diário em metadata e retorno tipado de limite diário.
- `src/app/(cms)/cms/dashboard/perfil/_features/Perfil/model.ts`: novos campos de limite restante e metadados do estado de erro.
- `src/app/(cms)/cms/dashboard/perfil/_features/Perfil/viewModel.tsx`: controle do modal de limite diário no ViewModel.
- `src/app/(cms)/cms/dashboard/perfil/_features/Perfil/view.tsx`: remoção da exclusão de conta, hints de limite diário e modal de aviso.
- `src/app/(cms)/cms/dashboard/perfil/page.tsx`: cálculo server-side de alterações restantes por dia.

## Decisões técnicas
- Mantida a abordagem atual de `user_metadata` para evitar introduzir arquitetura nova neste quick-fix.
- O limite considera janela móvel de 24 horas e libera nova tentativa quando a alteração mais antiga sai da janela.
- O fluxo de senha preserva o bloqueio existente de OTP real ainda não conectado; o limite diário já fica preparado para quando a alteração real for liberada.

## Observações fora do escopo
- Não foi implementada exclusão real de conta.
- Não foram criadas migrations/RPCs para persistir contador em tabela dedicada.

---

## Complemento — Avatar, crop e qualidade geral
Data: 2026-05-24

### Implementação
- Criado `AvatarCropDialog` com recorte circular, zoom e reposicionamento via canvas nativo, sem nova dependência.
- Integrado o crop ao `AvatarDropzone`, mantendo upload em WebP otimizado.
- Padronizado `UserAvatar` com fallback por iniciais e borda/ring para melhor contraste em modo claro/escuro.
- Corrigida a visualização do avatar nos menus laterais/dropdowns de aluno e CMS.
- Corrigidos diagnósticos de Biome no código-fonte e ajustado `biome.json` para não validar artefatos gerados do Synapos (`.synapos` e `docs/.squads`).

### Validações
- `npm run lint` passou.
- `npm run build` passou.
