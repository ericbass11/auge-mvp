"use client";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dados, ordenar, pct, pctReal, bateuMeta, moeda, delta } from "../../lib/dados";
import { Sparkline, Badge, ContadorAnimado } from "../../components/Visuais";

const MEDALHA = ["var(--ouro)", "var(--prata)", "var(--bronze)"];

export default function Painel() {
  const [lista, setLista] = useState([]);
  const campanha = dados.campanha();

  useEffect(() => {
    const cancelar = dados.inscrever((vs) => setLista(ordenar(vs)));
    return cancelar;
  }, []);

  const stats = useMemo(() => {
    const total = lista.reduce((s, v) => s + v.valor_atual, 0);
    const metaTotal = lista.reduce((s, v) => s + v.meta, 0);
    const bateram = lista.filter(bateuMeta).length;
    const topEvol = [...lista].sort((a, b) => (b.evolucao || 0) - (a.evolucao || 0))[0];
    return { total, metaTotal, bateram, topEvol, pctGeral: metaTotal ? Math.round((total / metaTotal) * 100) : 0 };
  }, [lista]);

  return (
    <main style={{ minHeight: "100vh", padding: "clamp(18px, 2.4vw, 40px)", display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Cabeçalho com placar geral */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "stretch", gap: 24, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ color: "var(--energia)", fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
            <PontoVivo /> Ranking ao vivo
          </div>
          <h1 style={{ fontFamily: "var(--display)", fontWeight: 900, fontSize: "clamp(34px, 4.6vw, 62px)", textTransform: "uppercase", lineHeight: 0.92 }}>{campanha.nome}</h1>
          <div style={{ color: "var(--texto-suave)", fontSize: 14, marginTop: 4 }}>Faltam <b style={{ color: "var(--texto)" }}>{campanha.diasRestantes} dias</b> para o fim</div>
        </div>

        {/* KPIs */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <KPI rotulo="Total vendido" valor={<ContadorAnimado valor={stats.total} format={moeda} />} cor="var(--energia)" />
          <KPI rotulo="Da meta global" valor={`${stats.pctGeral}%`} cor="var(--evolucao)" />
          <KPI rotulo="Bateram meta" valor={`${stats.bateram}/${lista.length}`} cor="var(--ouro)" />
        </div>
      </header>

      {/* Faixa de destaque de evolução */}
      {stats.topEvol && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(90deg, color-mix(in srgb, var(--evolucao) 14%, transparent), transparent)", border: "1px solid color-mix(in srgb, var(--evolucao) 35%, var(--borda))", borderRadius: 12, padding: "10px 18px", alignSelf: "flex-start" }}>
          <span style={{ color: "var(--evolucao)", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>↗ Maior evolução</span>
          <span style={{ fontWeight: 700, fontSize: 17 }}>{stats.topEvol.nome}</span>
          <span style={{ color: "var(--evolucao)", fontFamily: "var(--num)", fontWeight: 800, fontSize: 17 }}>+{stats.topEvol.evolucao}%</span>
          <span style={{ color: "var(--texto-suave)", fontSize: 13 }}>esta semana</span>
        </div>
      )}

      {/* Lista densa */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <AnimatePresence>
          {lista.map((v, i) => {
            const p = pct(v), pr = pctReal(v);
            const campeao = bateuMeta(v);
            const d = delta(v);
            return (
              <motion.div
                key={v.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "56px 1.4fr 90px auto",
                  alignItems: "center",
                  gap: "clamp(10px, 1.6vw, 24px)",
                  background: campeao ? "linear-gradient(90deg, color-mix(in srgb, var(--energia) 8%, var(--fundo-cartao)), var(--fundo-cartao))" : "var(--fundo-cartao)",
                  border: `1px solid ${campeao ? "var(--energia)" : "var(--borda)"}`,
                  borderRadius: 14,
                  padding: "clamp(12px, 1.3vw, 18px) clamp(14px, 1.8vw, 24px)",
                  boxShadow: campeao ? "0 0 24px rgba(182,242,61,0.16)" : "none",
                }}
              >
                {/* Posição */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--num)", fontWeight: 900, fontSize: "clamp(26px, 3vw, 44px)", color: i < 3 ? MEDALHA[i] : "var(--texto-fraco)", lineHeight: 1 }}>{i + 1}</span>
                  {i < 3 && <span style={{ fontSize: 9, color: MEDALHA[i], fontWeight: 700, letterSpacing: 1, marginTop: 2 }}>{["1º","2º","3º"][i]}</span>}
                </div>

                {/* Nome + barra + badges */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: "clamp(17px, 1.9vw, 26px)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.nome}</span>
                    {v.streak >= 3 && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--bronze)" }}>🔥 {v.streak} dias</span>}
                    <span style={{ display: "flex", gap: 5 }}>
                      {(v.badges || []).slice(0, 2).map((b) => <Badge key={b} id={b} mini />)}
                    </span>
                  </div>
                  <div style={{ height: 9, background: "var(--fundo)", borderRadius: 999, overflow: "hidden", position: "relative" }}>
                    <motion.div animate={{ width: `${p}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }}
                      style={{ height: "100%", borderRadius: 999, background: campeao ? "var(--energia)" : "linear-gradient(90deg, var(--energia-escura), var(--energia))" }} />
                  </div>
                </div>

                {/* Sparkline */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <Sparkline dados={v.hist || []} cor={campeao ? "var(--energia)" : "var(--evolucao)"} w={84} h={26} />
                  <span style={{ fontSize: 11, color: "var(--texto-fraco)" }}>tendência</span>
                </div>

                {/* Números */}
                <div style={{ textAlign: "right", minWidth: 140 }}>
                  <div style={{ fontFamily: "var(--num)", fontWeight: 800, fontSize: "clamp(19px, 2.3vw, 32px)", lineHeight: 1 }}>{moeda(v.valor_atual)}</div>
                  <div style={{ color: "var(--texto-suave)", fontSize: "clamp(11px, 1vw, 14px)", marginTop: 4 }}>
                    {pr}% da meta
                    {d > 0 && <span style={{ color: "var(--energia)", fontWeight: 700 }}> · ▲ {moeda(d)}</span>}
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

function KPI({ rotulo, valor, cor }) {
  return (
    <div style={{ background: "var(--fundo-cartao)", border: "1px solid var(--borda)", borderRadius: 12, padding: "12px 18px", minWidth: 130 }}>
      <div style={{ color: "var(--texto-suave)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{rotulo}</div>
      <div style={{ fontFamily: "var(--num)", fontWeight: 800, fontSize: 22, color: cor, marginTop: 3 }}>{valor}</div>
    </div>
  );
}

function PontoVivo() {
  return (
    <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.6 }}
      style={{ width: 9, height: 9, borderRadius: 999, background: "var(--energia)", display: "inline-block" }} />
  );
}
