# Auge — MVP (esqueleto / FDS 1)

Gamificação de vendas: **ranking ao vivo** no telão + visão no celular do vendedor,
com **celebração de conquistas** ao bater meta. Nome de trabalho provisório.

> Este é o esqueleto do primeiro fim de semana de construção. Já roda e é
> demonstrável. As animações de "revelação" (roleta/baú/raspadinha) entram no FDS 3.

## Rodar

Requer Node.js 18+.

```bash
npm install
npm run dev
```

Abra http://localhost:3000 e escolha uma das três telas:

- **/painel** — ranking ao vivo (para o telão / TV)
- **/gestor** — lançar os números de cada vendedor
- **/vendedor** — visão do vendedor no celular

## Modo demonstração

Sem configurar o Supabase, o app roda em **modo demo**: dados em memória, e o que
você lança na tela do gestor reflete na hora no painel e na tela do vendedor (na
mesma aba/dispositivo). Ótimo para mostrar a interface.

Para tempo real entre dispositivos diferentes (telão numa TV + celulares),
configure o Supabase:

1. Crie um projeto em supabase.com
2. Rode o SQL que está comentado em `lib/dados.js` (cria tabelas + ativa Realtime)
3. Copie `.env.example` para `.env.local` e preencha as chaves
4. Reinicie o `npm run dev`

## O que já existe (FDS 1)

- Estrutura Next.js + camada de dados com fallback demo
- Painel de ranking ao vivo com reordenação animada (Framer Motion)
- Tela do gestor para lançar valores
- Tela do vendedor (mobile) com posição e mini-ranking
- Destaque de "maior evolução" (recurso anti-toxicidade do conceito)
- Sistema de design (placar de arena: grafite + verde-energia + pódio)

## Próximos passos (conforme a spec do MVP)

- **FDS 2:** Supabase Realtime ligado (telão e celulares sincronizados de verdade)
- **FDS 3:** animação de revelação ao bater meta (roleta → baú → raspadinha) + confetes
- **FDS 4:** acabamento, as três mecânicas, polimento para a demo de venda

## Stack

Next.js · Framer Motion (animações) · Supabase (Postgres + Realtime) · CSS puro com
design tokens. Sem engine de jogo — este é um painel animado em tempo real, e a
stack web dá conta com folga.

---
*Eric Souza — Consultoria em Tecnologia e Inteligência Artificial.*
