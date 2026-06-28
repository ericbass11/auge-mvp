import "./globals.css";

export const metadata = {
  title: "Auge — Ranking de Vendas ao Vivo",
  description: "Gamificação de vendas: placar ao vivo e celebração de conquistas.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0E1320",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Display atlético condensado para números + body limpo */}
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800;900&family=Barlow+Semi+Condensed:wght@500;600;700&family=Barlow+Condensed:wght@600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
