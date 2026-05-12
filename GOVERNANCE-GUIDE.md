# NEXORA — Guia de Governança e Boas Práticas de Desenvolvimento

Este documento estabelece as diretrizes e boas práticas para contribuições ao projeto **Portal NEXORA**, abrangendo a criação de Issues, Commits e Pull Requests. O objetivo é garantir a consistência, a qualidade do código e a colaboração eficiente entre os membros da equipe, alinhando-se à arquitetura e às tecnologias adotadas pelo projeto.

---

## 1. Issues: O Ponto de Partida

Issues são a forma principal de rastrear tarefas, bugs, melhorias e novas funcionalidades. Uma boa Issue é clara, concisa e fornece contexto suficiente para que qualquer membro da equipe possa entender o problema ou a proposta.

### 1.1. Como Abrir uma Issue

Ao abrir uma nova Issue, siga estas recomendações:

- **Título Descritivo:** O título deve resumir o problema ou a funcionalidade de forma clara (ex: `Bug: Erro ao logar no CMS com credenciais válidas`, `Feature: Adicionar página de Cursos`).
- **Descrição Detalhada:** Inclua as seguintes seções:
    - **Contexto:** Explique a situação atual ou o cenário em que o problema ocorre/a funcionalidade é necessária.
    - **Problema/Proposta:** Descreva o bug (com passos para reproduzir, se aplicável) ou a funcionalidade desejada.
    - **Comportamento Esperado:** O que deveria acontecer ou como a funcionalidade deve operar.
    - **Referências:** Link para documentos relevantes (`docs/business`, `docs/specs`, `docs/tech-context`), designs ou outras Issues/PRs.
- **Etiquetas (Labels):** Utilize etiquetas para categorizar o Issue (ex: `bug`, `feature`, `enhancement`, `documentation`, `cms`, `public-site`).
- **Responsáveis (Assignees):** Atribua a Issue ao membro da equipe responsável, se souber.

### 1.2. Exemplos de Issues

| Tipo de Issue | Título Sugerido | Descrição (Exemplo) |
|---|---|---|
| **Bug** | `Bug: Formulário de registro do CMS não valida e-mail` | **Contexto:** Ao tentar registrar um novo usuário no CMS, o formulário aceita e-mails em formato inválido. **Problema:** O `schema.ts` do registro não está aplicando a validação de formato de e-mail. **Comportamento Esperado:** O formulário deve exibir uma mensagem de erro para e-mails inválidos. **Passos para Reproduzir:** 1. Acessar `/cms/register`. 2. Preencher com e-mail `teste@` e senha válida. 3. Clicar em Registrar. |
| **Feature** | `Feature: Implementar listagem de cursos na home` | **Contexto:** A home page atual não exibe os cursos disponíveis. **Proposta:** Adicionar uma seção na home page que liste os 3 cursos mais recentes, com link para a página de detalhes de cada curso. **Referências:** Design em Figma (link), `docs/business/features/catalog.md`. |
| **Melhoria** | `Enhancement: Otimizar carregamento de imagens na home` | **Contexto:** As imagens da seção Hero da home page estão demorando para carregar. **Proposta:** Implementar lazy loading e otimização de tamanho para as imagens, utilizando `next/image`. |

---

## 2. Commits: O Histórico do Projeto

Commits devem ser atômicos, ou seja, cada commit deve representar uma única mudança lógica. A mensagem do commit é crucial para manter um histórico limpo e compreensível.

### 2.1. Padrão de Commits Semânticos

O projeto adota o padrão de Commits Semânticos, que facilita a geração de changelogs e a compreensão do histórico. A estrutura básica é `tipo(escopo): mensagem`.

```
<tipo>(<escopo>): <mensagem>

[corpo opcional]

[rodapé opcional]
```

- **`<tipo>` (Obrigatório):** Define a natureza da mudança. Exemplos:
    - `feat`: Uma nova funcionalidade.
    - `fix`: Uma correção de bug.
    - `docs`: Alterações na documentação.
    - `style`: Mudanças que não afetam o significado do código (espaços em branco, formatação, ponto e vírgula ausente, etc.).
    - `refactor`: Uma mudança de código que não adiciona uma funcionalidade nem corrige um bug.
    - `perf`: Uma mudança de código que melhora o desempenho.
    - `test`: Adição ou correção de testes.
    - `chore`: Mudanças na build, dependências ou ferramentas (ex: atualização de pacotes).
    - `ci`: Mudanças nos arquivos e scripts de CI/CD.
    - `build`: Mudanças que afetam o sistema de build ou dependências externas (ex: npm, yarn).
    - `revert`: Reverte um commit anterior.
- **`<escopo>` (Opcional):** Indica a parte do sistema afetada pela mudança (ex: `cms`, `home`, `eventos`, `auth`, `ui`).
- **`<mensagem>` (Obrigatório):** Uma descrição concisa da mudança, no imperativo, com até 50 caracteres. Não finalize com ponto.
- **Corpo (Opcional):** Uma descrição mais detalhada da mudança, explicando o *porquê* e o *como*. Use o imperativo.
- **Rodapé (Opcional):** Usado para referenciar Issues (ex: `Closes #123`, `Fixes #456`) ou indicar *breaking changes* (`BREAKING CHANGE: ...`).

### 2.2. Exemplos de Mensagens de Commit

| Tipo | Exemplo |
|---|---|
| `feat` | `feat(eventos): adicionar filtro por data na listagem` |
| `fix` | `fix(cms): corrigir redirecionamento após login` |
| `docs` | `docs: atualizar guia de contribuição` |
| `chore` | `chore: atualizar dependências do Next.js` |
| `refactor` | `refactor(auth): mover lógica de sessão para hook` |

---

## 3. Pull Requests (PRs): Revisão e Integração

Pull Requests são a forma de propor mudanças ao código-fonte principal. Eles devem ser revisados por outros membros da equipe antes de serem mesclados.

### 3.1. Fluxo de Trabalho

1. **Crie uma Branch:** Sempre trabalhe em uma branch separada para cada funcionalidade ou correção (ex: `feature/nome-da-feature`, `bugfix/correcao-do-bug`).
2. **Commits Atômicos:** Certifique-se de que seus commits seguem o padrão semântico e são atômicos.
3. **Abra o Pull Request:** Ao abrir o PR, preencha o template com as informações necessárias.

### 3.2. Template de Pull Request

Um bom PR deve incluir:

- **Título:** Claro e conciso, refletindo a mudança principal (pode ser o mesmo do commit principal).
- **Descrição:**
    - **O que este PR faz?** Explique a mudança em alto nível.
    - **Por que esta mudança é necessária?** Contexto e justificativa (link para Issue).
    - **Como foi implementado?** Detalhes técnicos relevantes.
    - **Como testar?** Passos para que o revisor possa testar a funcionalidade.
    - **Screenshots/Vídeos (se aplicável):** Demonstrações visuais da mudança.
    - **Issues Relacionadas:** Use palavras-chave como `Closes #<numero-do-issue>` para vincular o PR ao Issue correspondente.
- **Checklist de Revisão (Sugestão):**
    - [ ] O código segue as convenções de estilo do projeto (Biome)?
    - [ ] Todos os testes foram executados e passaram?
    - [ ] A documentação foi atualizada (se aplicável)?
    - [ ] As variáveis de ambiente foram atualizadas (se aplicável)?
    - [ ] O `CHANGE GUARD` foi consultado e atualizado (se aplicável)?

### 3.3. Processo de Revisão

- **Revisores:** Pelo menos um outro membro da equipe deve revisar e aprovar o PR.
- **Comentários:** Utilize os comentários do GitHub para feedback e discussões.
- **Resolução de Conflitos:** O autor do PR é responsável por resolver quaisquer conflitos de merge.
- **Merge:** O PR só deve ser mesclado após a aprovação dos revisores e a resolução de todos os comentários.

---

## 4. Protocolo CHANGE GUARD

Conforme mencionado no `README.md` do projeto, o **CHANGE GUARD** é um protocolo para rastrear modificações passo a passo e manter a governança sobre o que entra em produção. Ao realizar mudanças significativas de fluxo, rota ou comportamento, é obrigatório consultar e, se necessário, atualizar este protocolo na pasta `docs/`.

---

## 5. Diretrizes Gerais de Contribuição

- **Conhecimento da Stack:** É indispensável ler a documentação específica do Next.js 16, React 19 e Tailwind v4, pois estas versões possuem *breaking changes*.
    - **Next.js 16:** Consulte `node_modules/next/dist/docs/` para APIs atuais.
    - **Tailwind v4:** A configuração é via CSS, não via `tailwind.config.js`.
    - **React 19:** O React Compiler está ativo; evite otimizações manuais desnecessárias (`useMemo`, `useCallback`).
- **Linting e Formatação:** Utilize `npm run lint` e `npm run format` para garantir a padronização do código com o Biome.
- **Arquitetura MVVM:** Siga rigorosamente o padrão MVVM para a criação de novas funcionalidades, conforme detalhado no `ADR-004: MVVM Page Architecture` e no `Guia Completo: Portal NEXORA`.

---

Este guia será um documento vivo, atualizado conforme a evolução do projeto e as necessidades da equipe. A adesão a estas práticas é fundamental para o sucesso e a sustentabilidade do Portal NEXORA.
