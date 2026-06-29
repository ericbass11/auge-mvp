"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { dados, ordenar, pct, pctReal, bateuMeta, moeda } from "../../lib/dados";
import { Badge } from "../../components/Visuais";
import Revelacao from "../../components/Revelacao";

export default function Gestor() {
  const [lista, setLista] = useState([]);
  const [editando, setEditando] = useState(null);
  const [valor, setValor] = useState("");
  const [revelacao, setRevelacao] = useState(null); // { nome, premioIndex }
  const campanha = dados.campanha();

  useEffect(() => {
    const cancelar = dados.inscrever((vs) => setLista(ordenar(vs)));
    return cancelar;
  }, []);

  function abrir(v) { setEditando(v.id); setValor(String(v.valor_atual)); }

  async function salvar(v) {
    const cruzou = await dados.atualizarValor(v.id, valor);
    setEditando(null); setValor("");
    if (cruzou) {
      const idx = Math.floor(Math.random() * campanha.premios.length);
      setRevelacao({ nome: v.nome, premioIndex: idx });
    }
  }

  return (
    <main style={{ minHeight: "100vh", padding: "clamp(20px, 3vw, 40px)", maxWidth: 820, margin: "0 auto" }}>
      <Revelacao
        aberto={!!revelacao}
        nome={revelacao?.nome}
        premios={campanha.premios}
        premioIndex={revelacao?.premioIndex ?? 0}
        mecanica={campanha.mecanica}
        onFechar={() => setRevelacao(null)}
      />

      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ color: "var(--energia)", fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", fontSize: 12 }}>Painel do gestor</div>
          <h1 style={{ fontFamily: "var(--display)", fontWeight: 900, fontSize: "clamp(28px, 5vw, 44px)", textTransform: "uppercase", lineHeight: 0.95 }}>{campanha.nome}</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--texto-suave)", border: "1px solid var(--borda)", borderRadius: 999, padding: "9px 14px" }}>Mecânica: {campanha.mecanica}</span>
          <Link href="/painel" style={{ fontSize: 13, fontWeight: 700, color: "#10210a", background: "var(--energia)", borderRadius: 999, padding: "9px 16px" }}>Ver telão →</Link>
        </div>
      </header>

      <p style={{ color: "var(--texto-suave)", fontSize: 14, marginBottom: 18 }}>
        Lance o valor atual de cada vendedor. Ao cruzar a meta, dispara a revelação do prêmio no telão e no celular.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {lista.map((v) => {
          const aberto = editando === v.id;
          const campeao = bateuMeta(v);
          return (
            <div key={v.id} style={{ background: "var(--fundo-cartao)", border: `1px solid ${campeao ? "var(--energia)" : "var(--borda)"}`, borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 17 }}>{v.nome}</span>
                    {v.streak >= 3 && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--bronze)" }}>🔥 {v.streak}</span>}
                    {(v.badges || []).slice(0, 2).map((b) => <Badge key={b} id={b} mini />)}
                  </div>
                  <div style={{ color: "var(--texto-suave)", fontSize: 13, marginTop: 4 }}>
                    {moeda(v.valor_atual)} / {moeda(v.meta)} · <span style={{ color: campeao ? "var(--energia)" : "var(--texto-suave)", fontWeight: 700 }}>{pctReal(v)}%</span>
                  </div>
                  <div style={{ height: 6, background: "var(--fundo)", borderRadius: 999, overflow: "hidden", marginTop: 8, maxWidth: 320 }}>
                    <div style={{ height: "100%", width: `${pct(v)}%`, background: campeao ? "var(--energia)" : "var(--energia-escura)", borderRadius: 999 }} />
                  </div>
                </div>
                {!aberto && (
                  <button onClick={() => abrir(v)} style={{ background: "var(--fundo-elevado)", color: "var(--texto)", border: "1px solid var(--borda)", borderRadius: 9, padding: "10px 18px", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>Lançar valor</button>
                )}
              </div>

              {aberto && (
                <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                  <input autoFocus type="number" value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && salvar(v)}
                    style={{ flex: 1, minWidth: 140, padding: "12px 14px", fontSize: 16, borderRadius: 9, border: "2px solid var(--energia)", background: "var(--fundo)", color: "var(--texto)", outline: "none", fontFamily: "var(--num)", fontWeight: 700 }} />
                  <button onClick={() => salvar(v)} style={{ background: "var(--energia)", color: "#10210a", border: "none", borderRadius: 9, padding: "0 22px", fontWeight: 800, fontSize: 15 }}>Salvar</button>
                  <button onClick={() => setEditando(null)} style={{ background: "transparent", color: "var(--texto-suave)", border: "1px solid var(--borda)", borderRadius: 9, padding: "0 16px", fontWeight: 700, fontSize: 14 }}>Cancelar</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 20, padding: 14, border: "1px dashed var(--borda)", borderRadius: 10, color: "var(--texto-fraco)", fontSize: 13 }}>
        Dica de demonstração: lance um valor acima da meta de alguém para ver a roleta de revelação disparar.
      </div>
    </main>
  );
}