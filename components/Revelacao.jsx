"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Confetes } from "./Visuais";

// ============================================================
// REVELAÇÃO — o momento "bet" (saudável)
// O prêmio é DEFINIDO pelo gestor (mérito). A mecânica (roleta,
// baú ou raspadinha) é só a forma de CELEBRAR — sempre revela o
// "premioIndex" informado. A emoção da incerteza fica na animação,
// nunca no resultado.
//
// A mecânica é fixa por campanha (prop "mecanica": roleta|bau|raspadinha).
// ============================================================
const CORES = ["#B6F23D", "#FFC24B", "#4BC8FF", "#A78BFA", "#FF8FA3", "#8FCB1E"];

export default function Revelacao({ aberto, nome, premios, premioIndex, mecanica = "roleta", onFechar }) {
  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(8,11,18,0.86)", backdropFilter: "blur(6px)", padding: 20 }}
        >
          <Moldura nome={nome}>
            {mecanica === "bau" && <Bau premios={premios} premioIndex={premioIndex} onFechar={onFechar} />}
            {mecanica === "raspadinha" && <Raspadinha premios={premios} premioIndex={premioIndex} onFechar={onFechar} />}
            {(mecanica === "roleta" || !["bau", "raspadinha"].includes(mecanica)) && (
              <Roleta premios={premios} premioIndex={premioIndex} onFechar={onFechar} />
            )}
          </Moldura>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------- Moldura comum (cartão + cabeçalho) ----------
function Moldura({ nome, children }) {
  return (
    <motion.div
      initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }}
      style={{ background: "var(--fundo-cartao)", border: "1px solid var(--borda)", borderRadius: 24, padding: "32px 28px", maxWidth: 380, width: "100%", textAlign: "center", position: "relative" }}
    >
      <div style={{ color: "var(--energia)", fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", fontSize: 13 }}>Meta batida!</div>
      <h2 style={{ fontFamily: "var(--display)", fontWeight: 900, fontSize: 30, textTransform: "uppercase", margin: "2px 0 18px", lineHeight: 1 }}>{nome}</h2>
      {children}
    </motion.div>
  );
}

// ---------- Resultado + botão (comum às 3 mecânicas) ----------
function Resultado({ revelado, premio, onFechar }) {
  return (
    <>
      <div style={{ minHeight: 64, marginTop: 18 }}>
        <AnimatePresence>
          {revelado && (
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
              <div style={{ color: "var(--texto-suave)", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>Conquistou</div>
              <div style={{ fontFamily: "var(--num)", fontWeight: 900, fontSize: 26, color: "var(--energia)" }}>{premio}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {revelado && (
        <button onClick={onFechar} style={{ marginTop: 14, background: "var(--energia)", color: "#10210a", border: "none", borderRadius: 999, padding: "13px 32px", fontWeight: 800, fontSize: 15, width: "100%" }}>
          Continuar
        </button>
      )}
    </>
  );
}

// ============================================================
// MECÂNICA 1 — ROLETA (gira e para no prêmio)
// ============================================================
function Roleta({ premios, premioIndex, onFechar }) {
  const n = premios.length;
  const fatia = 360 / n;
  const [revelado, setRevelado] = useState(false);
  const [rotacao, setRotacao] = useState(0);

  useEffect(() => {
    const voltas = 5;
    const alvo = 360 * voltas + (360 - (premioIndex * fatia + fatia / 2));
    const t = setTimeout(() => setRotacao(alvo), 80);
    const t2 = setTimeout(() => setRevelado(true), 4200);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [premioIndex, fatia]);

  const R = 150, cx = R, cy = R;
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
    <>
      <Confetes ativo={revelado} />
      <div style={{ position: "relative", width: 300, height: 300, margin: "0 auto" }}>
        <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", zIndex: 3, width: 0, height: 0, borderLeft: "11px solid transparent", borderRight: "11px solid transparent", borderTop: "18px solid var(--texto)" }} />
        <motion.svg width="300" height="300" viewBox="0 0 300 300"
          animate={{ rotate: rotacao }} transition={{ duration: 4, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))" }}>
          {setores.map((s, i) => (
            <path key={i} d={s.d} fill={s.cor} stroke="var(--fundo)" strokeWidth="2" />
          ))}
          {setores.map((s, i) => (
            <text key={i} x={s.tx} y={s.ty} fill="#10210a" fontSize="10" fontWeight="800"
              textAnchor="middle" dominantBaseline="middle"
              transform={`rotate(${s.ang} ${s.tx} ${s.ty})`} style={{ fontFamily: "var(--body)" }}>
              {s.label.length > 12 ? s.label.slice(0, 11) + "…" : s.label}
            </text>
          ))}
          <circle cx="150" cy="150" r="26" fill="var(--fundo-elevado)" stroke="var(--energia)" strokeWidth="3" />
        </motion.svg>
      </div>
      <Resultado revelado={revelado} premio={premios[premioIndex]} onFechar={onFechar} />
    </>
  );
}

// ============================================================
// MECÂNICA 2 — BAÚ (pulsa fechado; toque para abrir e revelar)
// ============================================================
function Bau({ premios, premioIndex, onFechar }) {
  const [aberto, setAberto] = useState(false);
  const [revelado, setRevelado] = useState(false);

  function abrir() {
    if (aberto) return;
    setAberto(true);
    setTimeout(() => setRevelado(true), 650);
  }

  return (
    <>
      <Confetes ativo={revelado} />
      <div style={{ position: "relative", width: 300, height: 300, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* brilho de fundo ao abrir */}
        <AnimatePresence>
          {aberto && (
            <motion.div
              initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1.4 }} transition={{ duration: 0.6 }}
              style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(182,242,61,0.55), transparent 70%)", zIndex: 0 }}
            />
          )}
        </AnimatePresence>

        <motion.button
          onClick={abrir}
          animate={aberto ? { scale: [1, 1.08, 1] } : { scale: [1, 1.04, 1] }}
          transition={aberto ? { duration: 0.4 } : { repeat: Infinity, duration: 1.4 }}
          style={{ background: "transparent", border: "none", cursor: aberto ? "default" : "pointer", zIndex: 1, position: "relative" }}
          aria-label="Abrir o baú"
        >
          <svg width="180" height="160" viewBox="0 0 180 160">
            {/* corpo do baú */}
            <rect x="20" y="70" width="140" height="74" rx="8" fill="#7A4A22" stroke="#5A3517" strokeWidth="3" />
            <rect x="20" y="70" width="140" height="20" fill="#8B5A2B" />
            {/* faixas metálicas */}
            <rect x="84" y="70" width="12" height="74" fill="#FFC24B" stroke="#B5852E" strokeWidth="1.5" />
            {/* tampa (gira ao abrir) */}
            <motion.g
              animate={aberto ? { rotateX: 0 } : {}}
              style={{ transformOrigin: "90px 70px" }}
              initial={false}
            >
              <motion.path
                d="M20 70 Q90 18 160 70 Z"
                fill="#8B5A2B" stroke="#5A3517" strokeWidth="3"
                animate={{ rotate: aberto ? -42 : 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 12 }}
                style={{ transformOrigin: "20px 70px" }}
              />
            </motion.g>
            {/* fechadura */}
            <circle cx="90" cy="104" r="9" fill="#FFC24B" stroke="#B5852E" strokeWidth="2" />
            <rect x="87" y="104" width="6" height="12" rx="2" fill="#5A3517" />
          </svg>
        </motion.button>
      </div>

      {!aberto && (
        <div style={{ color: "var(--texto-suave)", fontSize: 14, marginTop: 4 }}>Toque no baú para abrir</div>
      )}

      <Resultado revelado={revelado} premio={premios[premioIndex]} onFechar={onFechar} />
    </>
  );
}

// ============================================================
// MECÂNICA 3 — RASPADINHA (raspe a camada para revelar)
// Canvas com globalCompositeOperation = destination-out.
// Ao raspar ~55%, completa sozinha e revela.
// ============================================================
function Raspadinha({ premios, premioIndex, onFechar }) {
  const canvasRef = useRef(null);
  const [revelado, setRevelado] = useState(false);
  const raspandoRef = useRef(false);
  const prontoRef = useRef(false);
  const L = 280, A = 130;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    // camada "prata" por cima
    const grad = ctx.createLinearGradient(0, 0, L, A);
    grad.addColorStop(0, "#8A93A8");
    grad.addColorStop(0.5, "#C7D0E0");
    grad.addColorStop(1, "#8A93A8");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, L, A);
    ctx.fillStyle = "#5E6B86";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.fillText("RASPE AQUI", L / 2, A / 2 + 6);
    prontoRef.current = true;
  }, []);

  function pos(e) {
    const canvas = canvasRef.current;
    const r = canvas.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
    return { x: cx * (L / r.width), y: cy * (A / r.height) };
  }

  function raspar(e) {
    if (!raspandoRef.current || revelado) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = pos(e);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    checarProgresso(ctx);
  }

  function checarProgresso(ctx) {
    const img = ctx.getImageData(0, 0, L, A).data;
    let transparentes = 0;
    for (let i = 3; i < img.length; i += 4 * 40) {
      if (img[i] === 0) transparentes++;
    }
    const total = img.length / (4 * 40);
    if (transparentes / total > 0.55) finalizar();
  }

  function finalizar() {
    if (revelado) return;
    setRevelado(true);
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, L, A); // limpa tudo ao completar
  }

  return (
    <>
      <Confetes ativo={revelado} />
      <div style={{ position: "relative", width: L, height: A, margin: "0 auto", borderRadius: 14, overflow: "hidden", border: "1px solid var(--borda)" }}>
        {/* prêmio embaixo */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--fundo-elevado)" }}>
          <span style={{ color: "var(--texto-suave)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Você ganhou</span>
          <span style={{ fontFamily: "var(--num)", fontWeight: 900, fontSize: 28, color: "var(--energia)" }}>{premios[premioIndex]}</span>
        </div>
        {/* camada raspável */}
        <canvas
          ref={canvasRef} width={L} height={A}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", cursor: "grab", touchAction: "none", display: revelado ? "none" : "block" }}
          onMouseDown={() => (raspandoRef.current = true)}
          onMouseUp={() => (raspandoRef.current = false)}
          onMouseLeave={() => (raspandoRef.current = false)}
          onMouseMove={raspar}
          onTouchStart={(e) => { raspandoRef.current = true; raspar(e); }}
          onTouchEnd={() => (raspandoRef.current = false)}
          onTouchMove={raspar}
        />
      </div>
      {!revelado && <div style={{ color: "var(--texto-suave)", fontSize: 14, marginTop: 10 }}>Raspe a área prateada</div>}
      <Resultado revelado={revelado} premio={premios[premioIndex]} onFechar={onFechar} />
    </>
  );
}