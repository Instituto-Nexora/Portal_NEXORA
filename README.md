1# Portal NEXORA

Portal público e institucional do Instituto Nexora, desenvolvido com **Next.js App Router**, focado em divulgação de eventos, iniciativas, conteúdos educacionais e informações da organização.

O projeto utiliza **Synapos** como camada de organização de contexto, sessões, documentação viva e colaboração assistida por IA. Por isso, este `README.md` contém apenas as informações essenciais para instalar, rodar, acessar e contribuir com o projeto.

---

## Links rápidos

- **Produção:** [portalnexora.vercel.app](https://portalnexora.vercel.app)
- **Documentação interna:** [`docs/index.md`](./docs/index.md)
- **Instruções do projeto:** [`PROJECT-INSTRUCTIONS.md`](./PROJECT-INSTRUCTIONS.md)
- **Guia de governança:** [`GOVERNANCE-GUIDE.md`](./GOVERNANCE-GUIDE.md)

---

## Stack principal

- **Next.js** com App Router
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Supabase**
- **Biome**
- **Vercel**
- **Synapos**

---

## Requisitos

Antes de rodar o projeto, instale:

- Node.js 20+
- npm, pnpm, yarn ou bun
- Git

Recomendado:

- Conta no Supabase
- Conta na Vercel
- GitHub CLI, caso queira abrir Pull Requests pelo terminal

---

## Instalação

Clone o repositório:

```bash
git clone https://github.com/SEU_ORG/portal-nexora.git
cd portal-nexora
```

Instale as dependências:

```bash
npm install
```

Ou, se estiver usando outro gerenciador:

```bash
pnpm install
# ou
yarn install
# ou
bun install
```

---

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=
```

> Nunca envie arquivos `.env*` reais para o GitHub.

---

## Rodando localmente

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse:

```txt
http://localhost:3000
```

---

## Scripts úteis

```bash
npm run dev       # inicia o ambiente local
npm run build     # gera build de produção
npm run start     # executa build de produção localmente
npm run lint      # valida lint, se configurado
npm run format    # formata o código, se configurado
```

> Consulte o `package.json` para a lista exata de scripts disponíveis.

---

## Rotas principais

```txt
/                    # Home pública
/eventos             # Listagem pública de eventos
/eventos/[slug]      # Detalhe de evento
/cms/login           # Login do CMS
/cms/register        # Registro do CMS
/cms/dashboard       # Dashboard administrativo
```

---

## Fluxo de contribuição

Toda alteração relevante deve seguir o fluxo:

```txt
issue → branch → implementação → Pull Request → revisão → merge
```

Padrão de branches:

```txt
feature/nome-da-feature
bugfix/nome-do-bug
refactor/nome-do-refactor
docs/nome-da-doc
chore/nome-da-tarefa
```

Exemplo:

```bash
git checkout main
git pull origin main

git checkout -b feature/events-list
```

Depois da implementação:

```bash
git add .
git commit -m "feat: implementa listagem de eventos"
git push -u origin feature/events-list
```

Abra uma Pull Request para `main`.

---

## Uso com Synapos

Este projeto usa Synapos para organizar contexto, sessões e documentação viva.

Use o Synapos para tarefas que envolvem:

- feature nova
- bugfix com contexto acumulado
- refactor
- documentação técnica
- decisões arquiteturais
- handoff entre devs/agentes

Comando base:

```bash
npx synapos
```

As sessões e memórias de trabalho ficam em:

```txt
docs/.squads/sessions/
docs/_memory/
```

A documentação técnica, de negócio e decisões do projeto ficam em:

```txt
docs/
```

---

## Deploy

O deploy principal é feito na **Vercel**.

Fluxo esperado:

```txt
Pull Request aberta
→ Vercel cria Preview Deployment
→ revisão técnica
→ merge na main
→ deploy em produção
```

Ambiente de produção:

```txt
https://portalnexora.vercel.app
```

---

## Mantenedores

| Foto | Nome | GitHub | Foco |
|------|------|--------|------|
| <img src="https://github.com/viniciusgithub25.png" width="64" /> | Vinícius | [@viniciusgithub25](https://github.com/viniciusgithub25) | Produto, revisão geral e implementação |
| <img src="https://github.com/devjefferson.png" width="64" /> | Jefferson | [@devjefferson](https://github.com/devjefferson) | Full-stack, performance e arquitetura |
| <img src="https://github.com/tenmenezes.png" width="64" /> | Yago Menezes | [@tenmenezes](https://github.com/tenmenezes) | Full-stack, performance e arquitetura |
| <img src="https://github.com/CaioQuerino.png" width="64" /> | Caio Querino | [@CaioQuerino](https://github.com/CaioQuerino) | Full-stack, performance e arquitetura |
| <img src="https://github.com/rayrazer.png" width="64" /> | Ray Razer | [@RayRazer](https://github.com/rayrazer) | Full-stack, performance e arquitetura |

---

## Observações importantes

Este projeto não deve ter decisões relevantes documentadas apenas em conversas ou commits soltos.

Sempre que uma mudança afetar arquitetura, produto, autenticação, CMS, deploy ou fluxo de usuário, registre o contexto em `docs/` ou na session correspondente do Synapos.