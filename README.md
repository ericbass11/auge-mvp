# Auge — Gamificação de Vendas (versão encorpada)

Ranking de vendas **ao vivo** para telão + visão no **celular** do vendedor, com o
**momento de revelação** (roleta) ao bater meta. Nome de trabalho provisório.

## Rodar

Requer Node.js 18+.

```bash
npm install
npm run dev
```

Abra http://localhost:3000 e escolha:

- **/painel** — telão: ranking ao vivo, KPIs, sparklines, streaks, badges, deltas
- **/gestor** — lançar números; ao cruzar a meta, dispara a roleta de revelação
- **/vendedor** — celular: posição, tendência, quanto falta p/ ultrapassar, conquistas

> **Para ver a roleta:** na tela do gestor, lance um valor acima da meta de alguém
> que ainda não bateu (ex.: Bruno, meta R$ 40.000 → lance 45000).

## O que tem agora (versão rica)

- **Painel denso:** KPIs no topo (total vendido animado, % da meta global, quantos
  bateram), faixa de "maior evolução", e por vendedor: streak 🔥, badges, barra,
  sparkline de tendência, valor e delta do dia (▲).
- **Momento "bet":** roleta de revelação animada + confetes ao bater meta.
- **Vendedor (mobile):** card de posição, tendência pessoal, distância para
  ultrapassar o próximo, conquistas e ranking geral.
- **Anti-toxicidade:** destaque de quem mais evoluiu, não só do 1º lugar.

### O "DNA de bet" saudável
O prêmio é **definido pelo gestor** (mérito: bateu meta = conquistou). A roleta é só
a *celebração* — a emoção da incerteza fica na animação, não no resultado. Nunca se
sorteia se a pessoa merece, apenas *como* a conquista é revelada.

## Modo demonstração

Sem Supabase configurado, roda em **modo demo** (dados em memória). O que você lança
no gestor reflete no painel e no vendedor na mesma sessão. Para tempo real entre
dispositivos diferentes (telão na TV + celulares), configure o Supabase: rode o SQL
comentado em `lib/dados.js`, copie `.env.example` para `.env.local` e preencha.

## Stack

Next.js · Framer Motion (animações, roleta, contadores) · SVG/Canvas · Supabase
(Postgres + Realtime). Sem engine de jogo — é um painel animado em tempo real.

## Estrutura

```
app/         layout, home, /painel, /gestor, /vendedor, estilos globais
components/  Visuais (sparkline, badge, contador, confetes), Revelacao (roleta)
config/      tema.js — design tokens + dados demo (vendedores, badges, prêmios)
lib/         dados.js — camada de dados (demo + Supabase + Realtime)
```

---
*Eric Souza — Consultoria em Tecnologia e Inteligência Artificial.*
