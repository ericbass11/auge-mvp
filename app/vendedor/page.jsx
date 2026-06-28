"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { dados, ordenar, pct, bateuMeta, moeda } from "../../lib/dados";

export default function Vendedor() {
  const [lista, setLista] = useState([]);
  // No MVP, simula o vendedor logado como o primeiro do demo.
  // Na Fase 2 isso vem do login individual.
  const [meuId, setMeuId] = useState(null);

  useEffect(() => {
    const cancelar = dados.inscrever((vs) => {
      const ord = ordenar(vs);
      setLista(ord);
      if (!meuId && ord.length) setMeuId(ord[ord.length - 1].id); // demo: alguém no meio/fim
    });
    return cancelar;
  }, [meuId]);

  const minhaPos = lista.findIndex((v) => v.id === meuId);
  const eu = lista[minhaPos];

  return (
    <main style={{ minHeight: "100vh", padding: 20, maxWidth: 440, margin: "0 auto" }}>
      <div style={{ color: "var(--energia)", fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", fontSize: 12, marginBottom: 4 }}>Minha posição</div>

      {eu && (
        <>
          {/* Card do vendedor */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ background: "var(--fundo-cartao)", border: `1px solid ${bateuMeta(eu) ? "var(--energia)" : "var(--borda)"}`, borderRadius: 18, padding: 24, marginBottom: 20, boxShadow: bateuMeta(eu) ? "0 0 28px rgba(182,242,61,0.2)" : "none" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 700, fontSize: 22 }}>{eu.nome}</span>
              <span style={{ fontFamily: "var(--num)", fontWeight: 900, fontSize: 40, color: minhaPos < 3 ? "var(--ouro)" : "var(--texto)" }}>{minhaPos + 1}º</span>
            </div>

            <div style={{ margin: "18px 0 8px", height: 14, background: "var(--fundo)", borderRadius: 999, overflow: "hidden" }}>
              <motion.div animate={{ width: `${pct(eu)}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }}
                style={{ height: "100%", borderRadius: 999, background: "var(--energia)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--texto-suave)" }}>
              <span style={{ fontFamily: "var(--num)", fontWeight: 700, color: "var(--texto)" }}>{moeda(eu.valor_atual)}</span>
              <span>meta {moeda(eu.meta)} · {pct(eu)}%</span>
            </div>

            {bateuMeta(eu)
              ? <div style={{ marginTop: 16, color: "var(--energia)", fontWeight: 800, textAlign: "center", textTransform: "uppercase", letterSpacing: 1 }}>★ Meta batida!</div>
              : <div style={{ marginTop: 16, color: "var(--texto-suave)", fontSize: 14, textAlign: "center" }}>Faltam {moeda(eu.meta - eu.valor_atual)} para a meta</div>}
          </motion.div>
        </>
      )}

      {/* Mini-ranking */}
      <div style={{ color: "var(--texto-suave)", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Ranking</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {lista.map((v, i) => (
          <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 12, background: v.id === meuId ? "var(--fundo-elevado)" : "transparent", border: `1px solid ${v.id === meuId ? "var(--energia)" : "var(--borda)"}`, borderRadius: 10, padding: "10px 14px" }}>
            <span style={{ fontFamily: "var(--num)", fontWeight: 800, fontSize: 18, color: i < 3 ? "var(--ouro)" : "var(--texto-fraco)", width: 24 }}>{i + 1}</span>
            <span style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>{v.nome}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: bateuMeta(v) ? "var(--energia)" : "var(--texto-suave)" }}>{pct(v)}%</span>
          </div>
        ))}
      </div>
    </main>
  );
}
