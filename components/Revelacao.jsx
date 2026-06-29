"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Confetes } from "./Visuais";

// ============================================================
// REVELAÇÃO — o momento "bet" (saudável)
// O prêmio é DEFINIDO pelo gestor (mérito). A roleta é só a
// celebração: ela sempre para no índice "premioIndex" informado.
// A emoção da incerteza fica na animação, não no resultado.
// ============================================================
const CORES = ["#B6F23D", "#FFC24B", "#4BC8FF", "#A78BFA", "#FF8FA3", "#8FCB1E"];

export default function Revelacao({ aberto, nome, premios, premioIndex, onFechar }) {
  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(8,11,18,0.86)", backdropFilter: "blur(6px)", padding: 20 }}
        >
          <Roleta nome={nome} premios={premios} premioIndex={premioIndex} onFechar={onFechar} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Roleta({ nome, premios, premioIndex, onFechar }) {
  const n = premios.length;
  const fatia = 360 / n;
  const [girando, setGirando] = useState(true);
  const [revelado, setRevelado] = useState(false);
  const [rotacao, setRotacao] = useState(0);

  useEffect(() => {
    // calcula a rotação que faz a fatia premioIndex parar no topo (ponteiro)
    const voltas = 5;
    const alvo = 360 * voltas + (360 - (premioIndex * fatia + fatia / 2));
    const t = setTimeout(() => setRotacao(alvo), 80);
    const t2 = setTimeout(() => { setGirando(false); setRevelado(true); }, 4200);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [premioIndex, fatia]);

  const R = 150;
  const cx = R, cy = R;
  const setores = premios.map((p, i) => {
    const a0 = (i * fatia - 90) * (Math.PI / 180);
    const a1 = ((i + 1) * fatia - 90) * (Math.PI / 180);
    const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0);
    const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
    const grande = fatia > 180 ? 1 : 0;
    const d = `M ${cx} ${cy} L ${x0} ${y0} A ${R} ${R} 0 ${grande} 1 ${x1} ${y1} Z`;
    const am = (a0 + a1) / 2;
    const tx = cx + R * 0.62 * Math.cos(am), ty = cy + R * 0.62 * Math.sin(am);
    return { d, cor: CORES[i % CORES.length], label: p, tx, ty, ang: (i * fatia + fatia / 2) };
  });

  return (
    <motion.div
      initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }}
      style={{ background: "var(--fundo-cartao)", border: "1px solid var(--borda)", borderRadius: 24, padding: "32px 28px", maxWidth: 380, width: "100%", textAlign: "center", position: "relative" }}
    >
      <Confetes ativo={revelado} />
      <div style={{ color: "var(--energia)", fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", fontSize: 13 }}>Meta batida!</div>
      <h2 style={{ fontFamily: "var(--display)", fontWeight: 900, fontSize: 30, textTransform: "uppercase", margin: "2px 0 18px", lineHeight: 1 }}>{nome}</h2>

      {/* Roleta */}
      <div style={{ position: "relative", width: 300, height: 300, margin: "0 auto" }}>
        {/* ponteiro */}
        <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", zIndex: 3, width: 0, height: 0, borderLeft: "11px solid transparent", borderRight: "11px solid transparent", borderTop: "18px solid var(--texto)" }} />
        <motion.svg
          width="300" height="300" viewBox="0 0 300 300"
          animate={{ rotate: rotacao }}
          transition={{ duration: 4, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))" }}
        >
          <g transform="translate(0,0)">
            {setores.map((s, i) => (
              <path key={i} d={s.d} fill={s.cor} stroke="var(--fundo)" strokeWidth="2" transform="translate(0,0)" />
            ))}
          </g>
          {setores.map((s, i) => (
            <text key={i} x={s.tx} y={s.ty} fill="#10210a" fontSize="10" fontWeight="800"
              textAnchor="middle" dominantBaseline="middle"
              transform={`rotate(${s.ang} ${s.tx} ${s.ty})`}
              style={{ fontFamily: "var(--body)" }}>
              {s.label.length > 12 ? s.label.slice(0, 11) + "…" : s.label}
            </text>
          ))}
          <circle cx="150" cy="150" r="26" fill="var(--fundo-elevado)" stroke="var(--energia)" strokeWidth="3" />
        </motion.svg>
      </div>

      {/* Resultado */}
      <div style={{ minHeight: 64, marginTop: 18 }}>
        <AnimatePresence>
          {revelado && (
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
              <div style={{ color: "var(--texto-suave)", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>Conquistou</div>
              <div style={{ fontFamily: "var(--num)", fontWeight: 900, fontSize: 26, color: "var(--energia)" }}>{premios[premioIndex]}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {revelado && (
        <button onClick={onFechar} style={{ marginTop: 14, background: "var(--energia)", color: "#10210a", border: "none", borderRadius: 999, padding: "13px 32px", fontWeight: 800, fontSize: 15, width: "100%" }}>
          Continuar
        </button>
      )}
    </motion.div>
  );
}
