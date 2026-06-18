"use client";
import { Usuario } from "@/types";

type Tab = "dashboard" | "cadernos" | "entradas" | "humores";

interface SidebarProps {
  user: Usuario;
  activeTab: Tab;
  onTab: (t: Tab) => void;
  onLogout: () => void;
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "dashboard", label: "Início", icon: "🏠" },
  { id: "cadernos", label: "Cadernos", icon: "📒" },
  { id: "entradas", label: "Entradas", icon: "✏️" },
  { id: "humores", label: "Humores", icon: "😊" },
];

export default function Sidebar({ user, activeTab, onTab, onLogout }: SidebarProps) {
  return (
    <aside style={{
      position: "fixed", top: 0, left: 0, width: 210, height: "100vh",
      background: "var(--surface)", borderRight: "1px solid var(--border)",
      padding: "1.25rem 0.75rem", display: "flex", flexDirection: "column", gap: 2,
    }}>
      <p style={{ fontSize: 15, fontWeight: 600, padding: "0 8px", marginBottom: "0.75rem" }}>
        📔 Diário API
      </p>

      {tabs.map((t) => (
        <button
          key={t.id}
          className="ghost"
          onClick={() => onTab(t.id)}
          style={{
            textAlign: "left", display: "flex", alignItems: "center", gap: 8,
            padding: "7px 10px", borderRadius: 8, fontSize: 13,
            background: activeTab === t.id ? "var(--accent)" : "transparent",
            color: activeTab === t.id ? "#fff" : "var(--text-muted)",
            border: "none",
          }}
        >
          <span>{t.icon}</span> {t.label}
        </button>
      ))}

      <div style={{ marginTop: "auto" }}>
        <div style={{
          padding: "10px 12px", background: "var(--bg)", borderRadius: 8,
          marginBottom: 8, fontSize: 12,
        }}>
          <strong style={{ display: "block", fontSize: 13, color: "var(--text)" }}>{user.nome}</strong>
          <span style={{ color: "var(--text-muted)" }}>{user.email}</span>
        </div>
        <button className="danger" style={{ width: "100%", fontSize: 12 }} onClick={onLogout}>
          Sair
        </button>
      </div>
    </aside>
  );
}
