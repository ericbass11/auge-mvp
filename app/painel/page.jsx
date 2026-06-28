"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dados, ordenar, pct, bateuMeta, moeda } from "../../lib/dados";

const MEDALHA = ["var(--ouro)", "var(--prata)", "var(--bronze)"];

export default function Painel() {
  const [lista, setLista] = useState([]);
  const campanha = dados.campanha();

  useEffect(() => {
    const cancelar = dados.inscrever((vs) => setLista(ordenar(vs)));
    return cancelar;
  }, []);

  // maior evolução (anti-toxicidade: destaca quem mais cresceu, não só o 1º)
  const topEvolucao = [...lista].sort((a, b) => (b.evolucao || 0) - (a.evolucao || 0))[0];

  return (
    <main style={{ minHeight: "100vh", padding: "clamp(20px, 3vw, 48px)", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Cabeçalho */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid var(--borda)", paddingBottom: 18 }}>
        <div>
          <div style={{ color: "var(--energia)", fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", fontSize: 13 }}>Ranking ao vivo</div>
          <h1 style={{ fontFamily: "var(--display)", fontWeight: 900, fontSize: "clamp(34px, 5vw, 64px)", textTransform: "uppercase", lineHeight: 0.95 }}>{campanha.nome}</h1>
        </div>
        <PontoVivo />
      </header>

      {/* Destaque de evolução */}
      {topEvolucao && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--fundo-cartao)", border: "1px solid var(--borda)", borderRadius: 12, padding: "12px 18px", alignSelf: "flex-start" }}>
          <span style={{ color: "var(--evolucao)", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>↗ Maior evolução</span>
          <span style={{ fontFamily: "var(--body)", fontWeight: 700, fontSize: 18 }}>{topEvolucao.nome}</span>
          <span style={{ color: "var(--evolucao)", fontFamily: "var(--num)", fontWeight: 800, fontSize: 18 }}>+{topEvolucao.evolucao}%</span>
        </div>
      )}

      {/* Lista */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        <AnimatePresence>
          {lista.map((v, i) => {
            const p = pct(v);
            const campeao = bateuMeta(v);
            return (
              <motion.div
                key={v.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "64px 1fr auto",
                  alignItems: "center",
                  gap: "clamp(12px, 2vw, 28px)",
                  background: "var(--fundo-cartao)",
                  border: `1px solid ${campeao ? "var(--energia)" : "var(--borda)"}`,
                  borderRadius: 14,
                  padding: "clamp(14px, 1.6vw, 22px) clamp(16px, 2vw, 28px)",
                  boxShadow: campeao ? "0 0 24px rgba(182,242,61,0.18)" : "none",
                }}
              >
                {/* Posição */}
                <div style={{ fontFamily: "var(--num)", fontWeight: 900, fontSize: "clamp(28px, 3.4vw, 48px)", color: i < 3 ? MEDALHA[i] : "var(--texto-fraco)", textAlign: "center", lineHeight: 1 }}>
                  {i + 1}
                </div>

                {/* Nome + barra */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontFamily: "var(--body)", fontWeight: 700, fontSize: "clamp(18px, 2.2vw, 30px)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.nome}</span>
                    {campeao && <span style={{ color: "var(--energia)", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>★ Meta batida</span>}
                  </div>
                  <div style={{ height: 10, background: "var(--fundo)", borderRadius: 999, overflow: "hidden" }}>
                    <motion.div
                      animate={{ width: `${p}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                      style={{ height: "100%", borderRadius: 999, background: campeao ? "var(--energia)" : "linear-gradient(90deg, var(--energia-escura), var(--energia))" }}
                    />
                  </div>
                </div>

                {/* Números */}
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--num)", fontWeight: 800, fontSize: "clamp(20px, 2.6vw, 34px)", lineHeight: 1 }}>{moeda(v.valor_atual)}</div>
                  <div style={{ color: "var(--texto-suave)", fontSize: "clamp(12px, 1.2vw, 15px)", marginTop: 4 }}>
                    de {moeda(v.meta)} · <span style={{ color: campeao ? "var(--energia)" : "var(--texto-suave)", fontWeight: 700 }}>{p}%</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </main>
  );
}

function PontoVivo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--texto-suave)", fontSize: 13, fontWeight: 600 }}>
      <motion.span
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ repeat: Infinity, duration: 1.6 }}
        style={{ width: 9, height: 9, borderRadius: 999, background: "var(--energia)", display: "inline-block" }}
      />
      AO VIVO
    </div>
  );
}
