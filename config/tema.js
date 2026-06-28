// ============================================================
// SISTEMA DE DESIGN — Auge
// Direção: placar de arena esportiva. Legível de longe, atlético,
// energia de competição ao vivo. Não é dashboard corporativo nem
// cassino. Os NÚMEROS são os protagonistas.
// ============================================================

export const TEMA = {
  // Fundo: grafite azulado profundo (não preto puro — tem alma)
  fundo: "#0E1320",
  fundoElevado: "#161D2E",
  fundoCartao: "#1C2538",
  borda: "#2A3650",

  // Texto
  texto: "#F2F5FB",
  textoSuave: "#9AA7C2",
  textoFraco: "#5E6B86",

  // Energia / vitória (verde-limão elétrico, usado com restrição)
  energia: "#B6F23D",
  energiaEscura: "#8FCB1E",

  // Pódio
  ouro: "#FFC24B",
  prata: "#C7D0E0",
  bronze: "#E08A4B",

  // Alertas / evolução
  evolucao: "#4BC8FF", // azul para "maior evolução" (não compete com o verde)
  perigo: "#FF6B5E",
};

// Campanha de exemplo (modo DEMO, sem Supabase)
export const CAMPANHA_DEMO = {
  nome: "Corrida de Junho",
  mecanica: "roleta", // roleta | bau | raspadinha
};

export const VENDEDORES_DEMO = [
  { id: "1", nome: "Carla Mendes", meta: 50000, valor_atual: 47200, evolucao: 12 },
  { id: "2", nome: "Rafael Lima",  meta: 50000, valor_atual: 51800, evolucao: 8 },
  { id: "3", nome: "Bruno Souza",  meta: 40000, valor_atual: 38900, evolucao: 22 },
  { id: "4", nome: "Patrícia Reis", meta: 45000, valor_atual: 29500, evolucao: 31 },
  { id: "5", nome: "Diego Alves",  meta: 40000, valor_atual: 41200, evolucao: 5 },
  { id: "6", nome: "Larissa Khoury", meta: 55000, valor_atual: 33100, evolucao: 18 },
];
