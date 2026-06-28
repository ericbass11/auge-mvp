"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { dados, ordenar, pct, bateuMeta, moeda } from "../../lib/dados";

export default function Gestor() {
  const [lista, setLista] = useState([]);
  const [editando, setEditando] = useState(null);
  const [valor, setValor] = useState("");
  const campanha = dados.campanha();

  useEffect(() => {
    const cancelar = dados.inscrever((vs) => setLista(ordenar(vs)));
    return cancelar;
  }, []);

  function abrir(v) {
    setEditando(v.id);
    setValor(String(v.valor_atual));
  }

  async function salvar(id) {
    await dados.atualizarValor(id, valor);
    setEditando(null);
    setValor("");
  }

  return (
    <main style={{ minHeight: "100vh", padding: "clamp(20px, 3vw, 40px)", maxWidth: 760, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ color: "var(--energia)", fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", fontSize: 12 }}>Painel do gestor</div>
          <h1 style={{ fontFamily: "var(--display)", fontWeight: 900, fontSize: "clamp(28px, 5vw, 44px)", textTransform: "uppercase", lineHeight: 0.95 }}>{campanha.nome}</h1>
        </div>
        <Link href="/painel" style={{ fontSize: 13, fontWeight: 700, color: "var(--texto-suave)", border: "1px solid var(--borda)", borderRadius: 999, padding: "9px 16px" }}>
          Ver telão →
        </Link>
      </header>

      <p style={{ color: "var(--texto-suave)", fontSize: 14, marginBottom: 20 }}>
        Toque em um vendedor para lançar o valor atual. O telão e os celulares atualizam na hora.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {lista.map((v) => {
          const p = pct(v);
          const campeao = bateuMeta(v);
          const aberto = editando === v.id;
          return (
            <div key={v.id} style={{ background: "var(--fundo-cartao)", border: `1px solid ${campeao ? "var(--energia)" : "var(--borda)"}`, borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 17 }}>{v.nome}</div>
                  <div style={{ color: "var(--texto-suave)", fontSize: 13, marginTop: 2 }}>
                    {moeda(v.valor_atual)} / {moeda(v.meta)} · <span style={{ color: campeao ? "var(--energia)" : "var(--texto-suave)", fontWeight: 700 }}>{p}%</span>
                  </div>
                </div>
                {!aberto && (
                  <button onClick={() => abrir(v)} style={{ background: "var(--fundo-elevado)", color: "var(--texto)", border: "1px solid var(--borda)", borderRadius: 9, padding: "9px 16px", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>
                    Lançar valor
                  </button>
                )}
              </div>

              {aberto && (
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <input
                    autoFocus
                    type="number"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && salvar(v.id)}
                    style={{ flex: 1, padding: "12px 14px", fontSize: 16, borderRadius: 9, border: "2px solid var(--energia)", background: "var(--fundo)", color: "var(--texto)", outline: "none", fontFamily: "var(--num)", fontWeight: 700 }}
                  />
                  <button onClick={() => salvar(v.id)} style={{ background: "var(--energia)", color: "#10210a", border: "none", borderRadius: 9, padding: "0 22px", fontWeight: 800, fontSize: 15 }}>
                    Salvar
                  </button>
                  <button onClick={() => setEditando(null)} style={{ background: "transparent", color: "var(--texto-suave)", border: "1px solid var(--borda)", borderRadius: 9, padding: "0 16px", fontWeight: 700, fontSize: 14 }}>
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
