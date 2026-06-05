# Quick Fix Log
Data: 2026-05-24
Objetivo: Encerrar melhoria compartilhada dos perfis CMS e aluno.

O que foi feito: A tarefa interrompida foi retomada e concluída. O upload otimizado com crop/drag-and-drop já estava aplicado nos dois perfis, e as duplicações residuais de feedback, força de senha e resumo de identidade foram extraídas para componentes compartilhados.

Decisão técnica: Centralizar componentes puramente visuais em `src/components/shared/`, mantendo as regras de negócio nos ViewModels/actions existentes. O crop permanece com canvas nativo para evitar dependência externa.

Impacto: Os perfis CMS e aluno passam a compartilhar mais UI, reduzindo manutenção duplicada e preservando comportamento específico de cada fluxo.
