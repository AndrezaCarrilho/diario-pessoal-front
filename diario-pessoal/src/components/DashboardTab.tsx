"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Caderno, Entrada } from "@/types";

export default function DashboardTab() {
  const [cadernos, setCadernos] = useState<Caderno[]>([]);
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [apiOk, setApiOk] = useState<string | null>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("diario_token") || "");
    fetch("https://projeto-aos-diario-pessoal.vercel.app/")
      .then(r => r.text())
      .then(t => setApiOk("✅ " + t))
      .catch(() => setApiOk("❌ API inacessível ou CORS bloqueando"));

    api.listarCadernos().then(r => { if (r.ok) setCadernos(r.data as Caderno[]); });
    api.listarEntradas().then(r => { if (r.ok) setEntradas(r.data as Entrada[]); });
  }, []);

  const card = (num: number | string, label: string) => (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 12, padding: "1rem 1.25rem",
    }}>
      <div style={{ fontSize: 30, fontWeight: 700 }}>{num}</div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
    </div>
  );

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: "1.25rem" }}>Visão geral</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1.25rem" }}>
        {card(cadernos.length, "Cadernos")}
        {card(entradas.length, "Entradas")}
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: 12 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Status da API</p>
        <p style={{ fontSize: 13, color: apiOk?.startsWith("✅") ? "var(--success)" : "var(--danger)" }}>
          {apiOk ?? "Verificando..."}
        </p>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "1rem 1.25rem" }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Token JWT</p>
        <code style={{ fontSize: 10, wordBreak: "break-all", color: "var(--text-muted)", lineHeight: 1.6 }}>{token || "—"}</code>
      </div>
    </div>
  );
}
