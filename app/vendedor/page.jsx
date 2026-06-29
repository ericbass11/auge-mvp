"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { dados, ordenar, pct, pctReal, bateuMeta, moeda } from "../../lib/dados";
import { Sparkline, Badge, ContadorAnimado } from "../../components/Visuais";

export default function Vendedor() {
  const [lista, setLista] = useState([]);
  const [meuId, setMeuId] = useState(null);

  useEffect(() => {
    const cancelar = dados.inscrever((vs) => {
      const ord = ordenar(vs);
      setLista(ord);
      setMeuId((cur) => cur || ord[ord.length - 1]?.id);
    });
    return cancelar;
  }, []);

  const minhaPos = lista.findIndex((v) => v.id === meuId);
  const eu = lista[minhaPos];
  const acima = minhaPos > 0 ? lista[minhaPos - 1] : null;
  const faltaProxima = acima ? acima.valor_atual - (eu?.valor_atual || 0) : 0;

  return (
    <main style={{ minHeight: "100vh", padding: 18, maxWidth: 440, margin: "0 auto" }}>
      <div style={{ color: "var(--energia)", fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", fontSize: 12, marginBottom: 8 }}>Minha posição</div>

      {eu && (
        <>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: bateuMeta(eu) ? "linear-gradient(160deg, color-mix(in srgb, var(--energia) 12%, var(--fundo-cartao)), var(--fundo-cartao))" : "var(--fundo-cartao)", border: `1px solid ${bateuMeta(eu) ? "var(--energia)" : "var(--borda)"}`, borderRadius: 18, padding: 22, marginBottom: 16, boxShadow: bateuMeta(eu) ? "0 0 28px rgba(182,242,61,0.2)" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 22 }}>{eu.nome}</div>
                {eu.streak >= 1 && <div style={{ fontSize: 13, color: "var(--bronze)", fontWeight: 700, marginTop: 2 }}>🔥 {eu.streak} {eu.streak === 1 ? "dia" : "dias"} seguidos</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--num)", fontWeight: 900, fontSize: 40, color: minhaPos < 3 ? "var(--ouro)" : "var(--texto)", lineHeight: 1 }}>{minhaPos + 1}º</div>
                <div style={{ fontSize: 11, color: "var(--texto-suave)" }}>de {lista.length}</div>
              </div>
            </div>

            <div style={{ margin: "16px 0 8px", height: 14, background: "var(--fundo)", borderRadius: 999, overflow: "hidden" }}>
              <motion.div animate={{ width: `${pct(eu)}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }}
                style={{ height: "100%", borderRadius: 999, background: "var(--energia)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--texto-suave)" }}>
              <ContadorAnimado valor={eu.valor_atual} format={moeda} style={{ fontFamily: "var(--num)", fontWeight: 700, color: "var(--texto)" }} />
              <span>meta {moeda(eu.meta)} · {pctReal(eu)}%</span>
            </div>

            {bateuMeta(eu)
              ? <div style={{ marginTop: 14, color: "var(--energia)", fontWeight: 800, textAlign: "center", textTransform: "uppercase", letterSpacing: 1 }}>★ Meta batida!</div>
              : <div style={{ marginTop: 14, color: "var(--texto-suave)", fontSize: 14, textAlign: "center" }}>Faltam <b style={{ color: "var(--texto)" }}>{moeda(eu.meta - eu.valor_atual)}</b> para a meta</div>}
          </motion.div>

          {/* Cartões de info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            <div style={{ background: "var(--fundo-cartao)", border: "1px solid var(--borda)", borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 11, color: "var(--texto-suave)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Minha tendência</div>
              <div style={{ marginTop: 8 }}><Sparkline dados={eu.hist || []} cor="var(--evolucao)" w={150} h={40} /></div>
            </div>
            <div style={{ background: "var(--fundo-cartao)", border: "1px solid var(--borda)", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {acima ? (
                <>
                  <div style={{ fontSize: 11, color: "var(--texto-suave)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Para ultrapassar {acima.nome.split(" ")[0]}</div>
                  <div style={{ fontFamily: "var(--num)", fontWeight: 800, fontSize: 22, color: "var(--evolucao)", marginTop: 6 }}>{moeda(faltaProxima)}</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 11, color: "var(--texto-suave)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Posição</div>
                  <div style={{ fontFamily: "var(--num)", fontWeight: 800, fontSize: 20, color: "var(--ouro)", marginTop: 6 }}>👑 Líder</div>
                </>
              )}
            </div>
          </div>

          {/* Conquistas */}
          {(eu.badges || []).length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: "var(--texto-suave)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Minhas conquistas</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {eu.badges.map((b) => <Badge key={b} id={b} />)}
              </div>
            </div>
          )}
        </>
      )}

      {/* Mini-ranking */}
      <div style={{ color: "var(--texto-suave)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Ranking geral</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {lista.map((v, i) => (
          <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 12, background: v.id === meuId ? "var(--fundo-elevado)" : "transparent", border: `1px solid ${v.id === meuId ? "var(--energia)" : "var(--borda)"}`, borderRadius: 10, padding: "10px 14px" }}>
            <span style={{ fontFamily: "var(--num)", fontWeight: 800, fontSize: 18, color: i < 3 ? "var(--ouro)" : "var(--texto-fraco)", width: 24 }}>{i + 1}</span>
            <span style={{ flex: 1, fontWeight: 600, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.nome}</span>
            {v.streak >= 3 && <span style={{ fontSize: 12 }}>🔥</span>}
            <span style={{ fontSize: 13, fontWeight: 700, color: bateuMeta(v) ? "var(--energia)" : "var(--texto-suave)" }}>{pctReal(v)}%</span>
          </div>
        ))}
      </div>
    </main>
  );
}
