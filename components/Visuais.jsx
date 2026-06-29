"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BADGES } from "../config/tema";

// ---------- Mini gráfico de tendência (sparkline) ----------
export function Sparkline({ dados = [], cor = "var(--energia)", w = 90, h = 28 }) {
  if (!dados.length) return null;
  const max = Math.max(...dados), min = Math.min(...dados);
  const range = max - min || 1;
  const pts = dados.map((d, i) => {
    const x = (i / (dados.length - 1)) * w;
    const y = h - ((d - min) / range) * h;
    return `${x},${y}`;
  });
  const d = `M ${pts.join(" L ")}`;
  const area = `${d} L ${w},${h} L 0,${h} Z`;
  const id = `sl-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={cor} stopOpacity="0.35" />
          <stop offset="100%" stopColor={cor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={cor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------- Badge / conquista ----------
export function Badge({ id, mini = false }) {
  const b = BADGES[id];
  if (!b) return null;
  return (
    <span
      title={b.nome}
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        fontSize: mini ? 11 : 12, fontWeight: 700,
        color: b.cor, border: `1px solid ${b.cor}`, borderRadius: 999,
        padding: mini ? "1px 7px" : "3px 9px", lineHeight: 1.4,
        background: "color-mix(in srgb, var(--fundo) 70%, transparent)",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: mini ? 11 : 12 }}>{b.icone}</span>
      {!mini && b.nome}
    </span>
  );
}

// ---------- Número que conta animado ----------
export function ContadorAnimado({ valor, format = (n) => n, dur = 0.8, style }) {
  const [exibido, setExibido] = useState(valor);
  const anteriorRef = useRef(valor);
  useEffect(() => {
    const de = anteriorRef.current;
    const para = valor;
    if (de === para) return;
    let raf;
    const t0 = performance.now();
    const passo = (t) => {
      const p = Math.min(1, (t - t0) / (dur * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setExibido(de + (para - de) * eased);
      if (p < 1) raf = requestAnimationFrame(passo);
      else anteriorRef.current = para;
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [valor, dur]);
  return <span style={style}>{format(exibido)}</span>;
}

// ---------- Confetes ----------
export function Confetes({ ativo }) {
  if (!ativo) return null;
  const cores = ["#B6F23D", "#FFC24B", "#4BC8FF", "#A78BFA", "#FFFFFF"];
  const pecas = Array.from({ length: 80 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    dur: 1.8 + Math.random() * 1.8,
    cor: cores[i % cores.length],
    size: 7 + Math.random() * 8,
    redondo: Math.random() > 0.5,
    giro: Math.random() * 720,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 60 }}>
      {pecas.map((p, i) => (
        <motion.div
          key={i}
          initial={{ y: "-10vh", x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: "110vh", rotate: p.giro, opacity: [1, 1, 0.8] }}
          transition={{ duration: p.dur, delay: p.delay, ease: "easeIn" }}
          style={{ position: "absolute", top: 0, left: `${p.left}%`, width: p.size, height: p.size, background: p.cor, borderRadius: p.redondo ? "50%" : 2 }}
        />
      ))}
    </div>
  );
}
