"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Humor } from "@/types";
import ResponseBox from "./ResponseBox";

interface Props {
  onToast: (msg: string, err?: boolean) => void;
}

export default function HumoresTab({ onToast }: Props) {
  const [humores, setHumores] = useState<Humor[]>([]);
  const [nome, setNome] = useState("");
  const [emoji, setEmoji] = useState("");
  const [createRes, setCreateRes] = useState<{ data: unknown; ok: boolean } | null>(null);

  const [editId, setEditId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editEmoji, setEditEmoji] = useState("");
  const [editRes, setEditRes] = useState<{ data: unknown; ok: boolean } | null>(null);

  async function load() {
    const r = await api.listarHumores();
    if (r.ok) setHumores(r.data as Humor[]);
  }

  useEffect(() => { load(); }, []);

  async function criar(e: React.FormEvent) {
    e.preventDefault();
    const r = await api.criarHumor(nome, emoji);
    setCreateRes({ data: r.data, ok: r.ok });
    if (r.ok) { onToast("Humor criado!"); setNome(""); setEmoji(""); load(); }
    else onToast("Erro ao criar humor", true);
  }

  async function salvarEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;
    const r = await api.editarHumor(editId, editNome, editEmoji);
    setEditRes({ data: r.data, ok: r.ok });
    if (r.ok) { onToast("Humor atualizado!"); setEditId(null); load(); }
    else onToast("Erro ao editar", true);
  }

  async function deletar(id: string) {
    if (!confirm("Excluir este humor?")) return;
    const r = await api.deletarHumor(id);
    if (r.ok) { onToast("Humor excluído"); load(); }
    else onToast("Erro ao excluir", true);
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: "1.25rem" }}>Humores</h2>

      <Section title="Criar humor">
        <form onSubmit={criar} style={{ display: "flex", gap: 8 }}>
          <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome (ex: Feliz)" required />
          <input value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="Emoji" style={{ maxWidth: 90 }} required />
          <button type="submit" className="primary">Criar</button>
        </form>
        {createRes && <ResponseBox data={createRes.data} ok={createRes.ok} />}
      </Section>

      {editId && (
        <Section title="Editar humor">
          <form onSubmit={salvarEdit} style={{ display: "flex", gap: 8 }}>
            <input value={editNome} onChange={e => setEditNome(e.target.value)} required />
            <input value={editEmoji} onChange={e => setEditEmoji(e.target.value)} style={{ maxWidth: 90 }} required />
            <button type="submit" className="primary">Salvar</button>
            <button type="button" onClick={() => setEditId(null)}>Cancelar</button>
          </form>
          {editRes && <ResponseBox data={editRes.data} ok={editRes.ok} />}
        </Section>
      )}

      <Section title="Lista de humores">
        <button className="sm" onClick={load} style={{ marginBottom: 10 }}>Recarregar</button>
        {humores.length === 0
          ? <p style={{ color: "var(--text-faint)", fontSize: 13 }}>Nenhum humor cadastrado.</p>
          : humores.map(h => (
            <ItemRow key={h.id}>
              <span style={{ fontSize: 22 }}>{h.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 500 }}>{h.nome}</p>
                <p style={{ fontSize: 11, color: "var(--text-faint)" }}>{h.id}</p>
              </div>
              <button className="sm" onClick={() => { setEditId(h.id); setEditNome(h.nome); setEditEmoji(h.emoji); setEditRes(null); }}>Editar</button>
              <button className="sm danger" onClick={() => deletar(h.id)}>Excluir</button>
            </ItemRow>
          ))}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: 12 }}>
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: 10 }}>{title}</p>
      {children}
    </div>
  );
}

function ItemRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "var(--bg)", borderRadius: 8, marginBottom: 6 }}>
      {children}
    </div>
  );
}
