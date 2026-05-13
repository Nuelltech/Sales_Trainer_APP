import { useState } from "react";
import AppRCM from "./AppRCM";
import AppImobiliaria from "./AppImobiliaria";
import AppFarmaceutica from "./AppFarmaceutica";
import AppAutomovel from "./AppAutomovel";

export default function App() {
  const [industry, setIndustry] = useState(null);

  if (industry === "rcm") return <AppRCM />;
  if (industry === "imobiliaria") return <AppImobiliaria />;
  if (industry === "farmaceutica") return <AppFarmaceutica />;
  if (industry === "automovel") return <AppAutomovel />;

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <div style={styles.logo}>SIM</div>
        <h1 style={styles.title}>Simulador de Vendas Multi-Indústria</h1>
        <p style={styles.subtitle}>Escolha a área de negócio para treinar</p>
      </div>

      <div style={styles.grid2}>
        <button
          onClick={() => setIndustry("rcm")}
          style={{ ...styles.card, borderColor: "#f0b429", background: "rgba(240,180,41,0.1)" }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🍔</div>
          <div style={{ ...styles.cardName, color: "#f0b429" }}>Restauração (RCM)</div>
          <div style={styles.cardRole}>Simulação para venda de software de gestão a restaurantes.</div>
        </button>

        <button
          onClick={() => setIndustry("imobiliaria")}
          style={{ ...styles.card, borderColor: "#2980b9", background: "rgba(41,128,185,0.1)" }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏠</div>
          <div style={{ ...styles.cardName, color: "#2980b9" }}>Imobiliária</div>
          <div style={styles.cardRole}>Angariação, qualificação e venda de imóveis.</div>
        </button>

        <button
          onClick={() => setIndustry("farmaceutica")}
          style={{ ...styles.card, borderColor: "#8e44ad", background: "rgba(142,68,173,0.1)" }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>💊</div>
          <div style={{ ...styles.cardName, color: "#8e44ad" }}>Farmacêutica</div>
          <div style={styles.cardRole}>Propaganda médica, apresentação a clínicas e hospitais.</div>
        </button>

        <button
          onClick={() => setIndustry("automovel")}
          style={{ ...styles.card, borderColor: "#27ae60", background: "rgba(39,174,96,0.1)" }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
          <div style={{ ...styles.cardName, color: "#27ae60" }}>Automóvel (EV)</div>
          <div style={styles.cardRole}>Venda de veículos elétricos a particulares e frotas.</div>
        </button>
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0a0e17",
    color: "#e8eaf6",
    fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
    padding: "48px 16px",
    maxWidth: 600,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 32,
    alignItems: "center",
  },
  header: {
    textAlign: "center",
    paddingTop: 8,
  },
  logo: {
    display: "inline-block",
    background: "#fff",
    color: "#0a0e17",
    fontWeight: 900,
    fontSize: 14,
    letterSpacing: 3,
    padding: "4px 12px",
    borderRadius: 4,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    margin: 0,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "#888",
    fontSize: 14,
    margin: "12px 0 0",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    width: "100%",
  },
  card: {
    border: "2px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 24,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    color: "#e8eaf6",
  },
  cardName: {
    fontSize: 16,
    fontWeight: 800,
    marginBottom: 8,
  },
  cardRole: {
    fontSize: 12,
    color: "#aaa",
    lineHeight: 1.5,
  },
};
