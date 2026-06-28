"use client";
import Link from "next/link";
import { modoDemo } from "../lib/dados";

export default function Home() {
  const cards = [
    { href: "/painel", titulo: "Painel", sub: "Ranking ao vivo para o telão" },
    { href: "/gestor", titulo: "Gestor", sub: "Lançar números e configurar" },
    { href: "/vendedor", titulo: "Vendedor", sub: "Sua posição no celular" },
  ];
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, gap: 40 }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--display)", fontWeight: 900, fontSize: "clamp(48px, 12vw, 96px)", letterSpacing: -1, lineHeight: 0.9, textTransform: "uppercase" }}>
          Auge
        </h1>
        <p style={{ color: "var(--texto-suave)", fontSize: 17, marginTop: 8, maxWidth: 360 }}>
          O placar ao vivo que transforma metas de vendas em jogo.
        </p>
        {modoDemo && (
          <span style={{ display: "inline-block", marginTop: 14, fontSize: 12, fontWeight: 700, color: "var(--energia)", border: "1px solid var(--energia)", borderRadius: 999, padding: "4px 12px", textTransform: "uppercase", letterSpacing: 1 }}>
            Modo demonstração
          </span>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16, width: "100%", maxWidth: 680 }}>
        {cards.map((c) => (
          <Link key={c.href} href={c.href}
            style={{ background: "var(--fundo-cartao)", border: "1px solid var(--borda)", borderRadius: 16, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 6, transition: "border-color .2s, transform .2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--energia)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--borda)"; e.currentTarget.style.transform = "none"; }}>
            <span style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 26, textTransform: "uppercase" }}>{c.titulo}</span>
            <span style={{ color: "var(--texto-suave)", fontSize: 14 }}>{c.sub}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
