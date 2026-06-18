"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Caderno, Entrada, Humor } from "@/types";
import ResponseBox from "./ResponseBox";

interface Props { onToast: (msg: string, err?: boolean) => void; }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: 12 }}>
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: 10 }}>{title}</p>
      {children}
    </div>
  );
}

export default function EntradasTab({ onToast }: Props) {
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [cadernos, setCadernos] = useState<Caderno[]>([]);
  const [humores, setHumores] = useState<Humor[]>([]);

  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [cadernoId, setCadernoId] = useState("");
  const [humorId, setHumorId] = useState("");
  const [createRes, setCreateRes] = useState<{ data: unknown; ok: boolean } | null>(null);

  const [editId, setEditId] = useState<string | null>(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editConteudo, setEditConteudo] = useState("");
  const [editHumorId, setEditHumorId] = useState("");
  const [editRes, setEditRes] = useState<{ data: unknown; ok: boolean } | null>(null);

  async function load() {
    const [re, rc, rh] = await Promise.all([
      api.listarEntradas(), api.listarCadernos(), api.listarHumores()
    ]);
    if (re.ok) { const d = re.data as Entrada[]; setEntradas(d); }
    if (rc.ok) { const d = rc.data as Caderno[]; setCadernos(d); if (d.length) setCadernoId(d[0].id); }
    if (rh.ok) { const d = rh.data as Humor[]; setHumores(d); if (d.length) setHumorId(d[0].id); }
  }

  useEffect(() => { load(); }, []);

  async function criar(e: React.FormEvent) {
    e.preventDefault();
    const r = await api.criarEntrada(titulo, conteudo, cadernoId, humorId);
    setCreateRes({ data: r.data, ok: r.ok });
    if (r.ok) { onToast("Entrada criada!"); setTitulo(""); setConteudo(""); load(); }
    else onToast("Erro ao criar entrada", true);
  }

  async function salvarEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;
    const r = await api.editarEntrada(editId, editTitulo, editConteudo, editHumorId);
    setEditRes({ data: r.data, ok: r.ok });
    if (r.ok) { onToast("Entrada atualizada!"); setEditId(null); load(); }
    else onToast("Erro ao editar", true);
  }

  async function deletar(id: string) {
    if (!confirm("Excluir esta entrada?")) return;
    const r = await api.deletarEntrada(id);
    if (r.ok) { onToast("Entrada excluída"); load(); }
    else onToast("Erro ao excluir", true);
  }

  function prepEdit(e: Entrada) {
    setEditId(e.id); setEditTitulo(e.titulo);
    setEditConteudo(e.conteudo || ""); setEditHumorId(e.humorId || "");
    setEditRes(null);
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: "1.25rem" }}>Entradas do diário</h2>

      <Section title="Nova entrada">
        <form onSubmit={criar} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <label>Título</label>
            <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="O que aconteceu hoje..." required />
          </div>
          <div>
            <label>Conteúdo</label>
            <textarea value={conteudo} onChange={e => setConteudo(e.target.value)} placeholder="Escreva aqui..." required />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label>Caderno</label>
              <select value={cadernoId} onChange={e => setCadernoId(e.target.value)} required>
                {cadernos.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
              </select>
            </div>
            <div>
              <label>Humor</label>
              <select value={humorId} onChange={e => setHumorId(e.target.value)} required>
                {humores.map(h => <option key={h.id} value={h.id}>{h.emoji} {h.nome}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="primary" style={{ alignSelf: "flex-start" }}>Salvar entrada</button>
        </form>
        {createRes && <ResponseBox data={createRes.data} ok={createRes.ok} />}
      </Section>

      {editId && (
        <Section title="Editar entrada">
          <form onSubmit={salvarEdit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <label>Título</label>
              <input value={editTitulo} onChange={e => setEditTitulo(e.target.value)} required />
            </div>
            <div>
              <label>Conteúdo</label>
              <textarea value={editConteudo} onChange={e => setEditConteudo(e.target.value)} />
            </div>
            <div>
              <label>Humor</label>
              <select value={editHumorId} onChange={e => setEditHumorId(e.target.value)}>
                {humores.map(h => <option key={h.id} value={h.id}>{h.emoji} {h.nome}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="primary">Salvar</button>
              <button type="button" onClick={() => setEditId(null)}>Cancelar</button>
            </div>
          </form>
          {editRes && <ResponseBox data={editRes.data} ok={editRes.ok} />}
        </Section>
      )}

      <Section title="Minhas entradas">
        <button className="sm" onClick={load} style={{ marginBottom: 10 }}>Recarregar</button>
        {entradas.length === 0
          ? <p style={{ color: "var(--text-faint)", fontSize: 13 }}>Nenhuma entrada ainda.</p>
          : entradas.map(e => (
            <div key={e.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: "var(--bg)", borderRadius: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 22, marginTop: 2 }}>{e.humor?.emoji || "📝"}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 500 }}>{e.titulo}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "2px 0" }}>{e.conteudo?.slice(0, 80)}{e.conteudo?.length > 80 ? "..." : ""}</p>
                <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                  <Tag>{e.caderno?.titulo || "sem caderno"}</Tag>
                  <Tag>{e.humor?.nome || "sem humor"}</Tag>
                </div>
              </div>
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                <button className="sm" onClick={() => prepEdit(e)}>Editar</button>
                <button className="sm danger" onClick={() => deletar(e.id)}>Excluir</button>
              </div>
            </div>
          ))}
      </Section>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#e8e8e3", color: "#555" }}>
      {children}
    </span>
  );
}
