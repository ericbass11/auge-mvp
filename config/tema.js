// ============================================================
// SISTEMA DE DESIGN — Auge
// Direção: placar de arena esportiva. Legível de longe, atlético,
// energia de competição ao vivo, denso e vivo. Os NÚMEROS são os
// protagonistas. Não é dashboard corporativo nem cassino.
// ============================================================

export const TEMA = {
  fundo: "#0E1320",
  fundoElevado: "#161D2E",
  fundoCartao: "#1C2538",
  borda: "#2A3650",
  texto: "#F2F5FB",
  textoSuave: "#9AA7C2",
  textoFraco: "#5E6B86",
  energia: "#B6F23D",
  energiaEscura: "#8FCB1E",
  ouro: "#FFC24B",
  prata: "#C7D0E0",
  bronze: "#E08A4B",
  evolucao: "#4BC8FF",
  perigo: "#FF6B5E",
  roxo: "#A78BFA",
};

export const CAMPANHA_DEMO = {
  nome: "Corrida de Junho",
  mecanica: "roleta", // roleta | bau | raspadinha
  diasRestantes: 8,
  premios: ["Bônus R$ 500", "Day-off", "Vale-jantar", "Bônus R$ 200", "Vaga VIP", "Brinde"],
};

// Catálogo de conquistas (badges)
export const BADGES = {
  meta:     { id: "meta",     nome: "Meta batida",     icone: "★",  cor: "var(--energia)" },
  streak3:  { id: "streak3",  nome: "3 dias seguidos", icone: "🔥", cor: "var(--bronze)" },
  streak7:  { id: "streak7",  nome: "Semana cheia",    icone: "🔥", cor: "var(--ouro)" },
  primeiro: { id: "primeiro", nome: "Líder",           icone: "👑", cor: "var(--ouro)" },
  evolucao: { id: "evolucao", nome: "Em ascensão",     icone: "↗",  cor: "var(--evolucao)" },
  virada:   { id: "virada",   nome: "Virada",          icone: "⚡", cor: "var(--roxo)" },
};

// Vendedores com profundidade: streak, histórico (sparkline), badges, evolução
export const VENDEDORES_DEMO = [
  { id: "1", nome: "Carla Mendes",   meta: 50000, valor_atual: 47200, ontem: 44100, streak: 4, evolucao: 12, hist: [12,18,22,28,34,40,44,47], badges: ["streak3","evolucao"] },
  { id: "2", nome: "Rafael Lima",    meta: 50000, valor_atual: 51800, ontem: 49000, streak: 7, evolucao: 8,  hist: [20,26,31,37,42,46,49,52], badges: ["meta","streak7","primeiro"] },
  { id: "3", nome: "Bruno Souza",    meta: 40000, valor_atual: 38900, ontem: 31000, streak: 2, evolucao: 22, hist: [8,12,15,19,24,29,34,39], badges: ["evolucao","virada"] },
  { id: "4", nome: "Patrícia Reis",  meta: 45000, valor_atual: 29500, ontem: 21800, streak: 3, evolucao: 31, hist: [5,8,11,14,18,22,26,30], badges: ["streak3","evolucao"] },
  { id: "5", nome: "Diego Alves",    meta: 40000, valor_atual: 41200, ontem: 39500, streak: 5, evolucao: 5,  hist: [22,27,31,34,37,39,40,41], badges: ["meta","streak3"] },
  { id: "6", nome: "Larissa Khoury", meta: 55000, valor_atual: 33100, ontem: 28000, streak: 1, evolucao: 18, hist: [9,13,17,21,25,28,30,33], badges: ["evolucao"] },
];
