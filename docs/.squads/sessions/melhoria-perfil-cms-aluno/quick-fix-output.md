# Quick Fix Output — Frontend
Data: 2026-05-24
Objetivo: Fechar melhoria de reuso, upload otimizado e UX dos perfis CMS e aluno.

## Implementação
- Confirmado que o upload de avatar compartilhado já está centralizado em `AvatarDropzone` e usado nos perfis CMS e aluno.
- Confirmado que o recorte/otimização client-side já está implementado em `AvatarCropDialog` com canvas nativo e saída WebP.
- Extraídos componentes compartilhados adicionais para remover duplicações residuais entre os perfis:
  - `ProfileActionStatus` para feedback de ações de formulário;
  - `PasswordStrengthMeter` para exibição padronizada de força de senha;
  - `ProfileIdentitySummary` para resumo visual de nome/e-mail abaixo do avatar.
- Atualizados os perfis CMS e aluno para consumir os componentes compartilhados.

## Arquivos modificados
- `src/components/shared/ProfileActionStatus.tsx`: feedback reutilizável de sucesso/erro.
- `src/components/shared/PasswordStrengthMeter.tsx`: medidor reutilizável de força de senha.
- `src/components/shared/ProfileIdentitySummary.tsx`: resumo reutilizável de identidade do perfil.
- `src/app/(private)/perfil/features/view.tsx`: uso dos componentes compartilhados no perfil do aluno.
- `src/app/(cms)/cms/dashboard/perfil/_features/Perfil/view.tsx`: uso dos componentes compartilhados no perfil CMS.

## Decisões técnicas
- Mantido o crop/otimização com canvas nativo, sem nova dependência.
- Componentes compartilhados foram criados em `src/components/shared/`, respeitando o escopo original de extrair duplicações entre CMS e perfil do aluno.
- Não foram alteradas server actions, autenticação ou regras de banco, conforme fora do escopo.

## Observações fora do escopo
- Diferenças específicas de negócio entre CMS e aluno foram preservadas: limite diário/OTP no CMS e fluxo direto do aluno.
