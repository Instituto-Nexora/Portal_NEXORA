# ADR 001: Escolha do Supabase como BaaS

**Status:** Aceito  
**Data:** (Criado durante Setup Técnico)

## Contexto
O Portal NEXORA requer um sistema robusto para o gerenciamento de usuários (autenticação/sessões) e persistência de dados (banco de dados) relacionais para entidades de negócios e CMS. Considerando que o time está focando em entregas ágeis, construir e manter uma infraestrutura de autenticação do zero ou provisionar um banco de dados solto consumiria muito esforço de desenvolvimento e devops inicial.

## Opções Consideradas
- Backend Node.js Customizado + PostgreSQL no AWS/Render
- Firebase (NoSQL)
- Supabase (PostgreSQL Gerenciado + Auth)

## Decisão
Decidimos utilizar o **Supabase** como nossa plataforma de Backend as a Service (BaaS) principal.

## Justificativa
1. **Produtividade Imediata:** O Supabase fornece Auth e banco de dados PostgreSQL prontos para consumo, acelerando drasticamente o setup de infraestrutura.
2. **Row Level Security (RLS):** Como utiliza o PostgreSQL debaixo dos panos, podemos escrever regras de autorização granulares diretamente nas tabelas (RLS), garantindo que a área logada `(private)` esteja blindada no nível do banco, reduzindo código de validação complexo no Node.js.
3. **Ecossistema e SSR:** A biblioteca `@supabase/ssr` se integra perfeitamente ao Next.js 16 (App Router) e Server Actions, nosso principal padrão arquitetural.

## Consequências
- Dependência forte (vendor lock-in) com os pacotes e ecosistema Supabase.
- O time de engenharia precisará dominar políticas RLS (SQL) para não introduzir falhas de segurança nos dados.
