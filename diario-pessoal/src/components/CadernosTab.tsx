"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Caderno, Entrada } from "@/types";
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

function ItemRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "var(--bg)", borderRadius: 8, marginBottom: 6 }}>
      {children}
    </div>
  );
}

export default function CadernosTab({ onToast }: Props) {
  const [cadernos, setCadernos] = useState<Caderno[]>([]);
  const [titulo, setTitulo] = useState("");
  const [createRes, setCreateRes] = useState<{ data: unknown; ok: boolean } | null>(null);

  const [editId, setEditId] = useState<string | null>(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editRes, setEditRes] = useState<{ data: unknown; ok: boolean } | null>(null);

  const [viewId, setViewId] = useState<string | null>(null);
  const [viewTitulo, setViewTitulo] = useState("");
  const [viewEntradas, setViewEntradas] = useState<Entrada[]>([]);

  async function load() {
    const r = await api.listarCadernos();
    if (r.ok) setCadernos(r.data as Caderno[]);
  }

  useEffect(() => { load(); }, []);

  async function criar(e: React.FormEvent) {
    e.preventDefault();
    const r = await api.criarCaderno(titulo);
    setCreateRes({ data: r.data, ok: r.ok });
    if (r.ok) { onToast("Caderno criado!"); setTitulo(""); load(); }
    else onToast("Erro ao criar caderno", true);
  }

  async function salvarEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;
    const r = await api.editarCaderno(editId, editTitulo);
    setEditRes({ data: r.data, ok: r.ok });
    if (r.ok) { onToast("Caderno atualizado!"); setEditId(null); load(); }
    else onToast("Erro ao editar", true);
  }

  async function deletar(id: string) {
    if (!confirm("Excluir este caderno e todas as suas entradas?")) return;
    const r = await api.deletarCaderno(id);
    if (r.ok) { onToast("Caderno excluído"); load(); }
    else onToast("Erro ao excluir", true);
  }

  async function verEntradas(id: string, titulo: string) {
    setViewId(id); setViewTitulo(titulo);
    const r = await api.entradasDoCaderno(id);
    if (r.ok) setViewEntradas(r.data as Entrada[]);
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: "1.25rem" }}>Cadernos</h2>

      <Section title="Novo caderno">
        <form onSubmit={criar} style={{ display: "flex", gap: 8 }}>
          <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título do caderno" required />
          <button type="submit" className="primary">Criar</button>
        </form>
        {createRes && <ResponseBox data={createRes.data} ok={createRes.ok} />}
      </Section>

      {editId && (
        <Section title="Editar caderno">
          <form onSubmit={salvarEdit} style={{ display: "flex", gap: 8 }}>
            <input value={editTitulo} onChange={e => setEditTitulo(e.target.value)} required />
            <button type="submit" className="primary">Salvar</button>
            <button type="button" onClick={() => setEditId(null)}>Cancelar</button>
          </form>
          {editRes && <ResponseBox data={editRes.data} ok={editRes.ok} />}
        </Section>
      )}

      <Section title="Meus cadernos">
        <button className="sm" onClick={load} style={{ marginBottom: 10 }}>Recarregar</button>
        {cadernos.length === 0
          ? <p style={{ color: "var(--text-faint)", fontSize: 13 }}>Nenhum caderno encontrado.</p>
          : cadernos.map(c => (
            <ItemRow key={c.id}>
              <span style={{ fontSize: 20 }}>📒</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.titulo}</p>
                <p style={{ fontSize: 11, color: "var(--text-faint)" }}>{c.id}</p>
              </div>
              <button className="sm" onClick={() => verEntradas(c.id, c.titulo)}>Entradas</button>
              <button className="sm" onClick={() => { setEditId(c.id); setEditTitulo(c.titulo); setEditRes(null); }}>Editar</button>
              <button className="sm danger" onClick={() => deletar(c.id)}>Excluir</button>
            </ItemRow>
          ))}
      </Section>

      {viewId && (
        <Section title={`Entradas de: ${viewTitulo}`}>
          <button className="sm ghost" onClick={() => setViewId(null)} style={{ marginBottom: 10 }}>✕ Fechar</button>
          {viewEntradas.length === 0
            ? <p style={{ color: "var(--text-faint)", fontSize: 13 }}>Nenhuma entrada neste caderno.</p>
            : viewEntradas.map(e => (
              <ItemRow key={e.id}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500 }}>{e.titulo}</p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{e.conteudo?.slice(0, 80)}...</p>
                </div>
              </ItemRow>
            ))}
        </Section>
      )}
    </div>
  );
}
