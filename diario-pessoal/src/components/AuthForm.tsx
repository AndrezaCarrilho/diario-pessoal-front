"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { Usuario } from "@/types";
import ResponseBox from "./ResponseBox";

interface AuthFormProps {
  onLogin: (user: Usuario, token: string) => void;
}

export default function AuthForm({ onLogin }: AuthFormProps) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ data: unknown; ok: boolean } | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");

  const [signupNome, setSignupNome] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupSenha, setSignupSenha] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await api.login(loginEmail, loginSenha);
    setResponse({ data: res.data, ok: res.ok });
    if (res.ok) {
      const d = res.data as { user: Usuario; token: string };
      localStorage.setItem("diario_token", d.token);
      localStorage.setItem("diario_user", JSON.stringify(d.user));
      onLogin(d.user, d.token);
    }
    setLoading(false);
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await api.signup(signupNome, signupEmail, signupSenha);
    setResponse({ data: res.data, ok: res.ok });
    if (res.ok) setTab("login");
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "var(--bg)",
    }}>
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 16, padding: "2rem", width: 380,
      }}>
        <p style={{ fontSize: 28, marginBottom: 4 }}>📔</p>
        <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Diário Pessoal</h1>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          Teste da API — <code style={{ fontSize: 11 }}>vercel.app + render</code>
        </p>

        <div style={{ display: "flex", gap: 4, marginBottom: "1.5rem" }}>
          {(["login", "signup"] as const).map((t) => (
            <button
              key={t}
              className={tab === t ? "primary" : ""}
              style={{ flex: 1 }}
              onClick={() => { setTab(t); setResponse(null); }}
            >
              {t === "login" ? "Entrar" : "Cadastrar"}
            </button>
          ))}
        </div>

        {tab === "login" ? (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <label>Email</label>
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                placeholder="alice@email.com" required />
            </div>
            <div>
              <label>Senha</label>
              <input type="password" value={loginSenha} onChange={e => setLoginSenha(e.target.value)}
                placeholder="••••••" required />
            </div>
            <button type="submit" className="primary" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <p style={{ fontSize: 11, color: "var(--text-faint)", textAlign: "center" }}>
              Seed: alice@email.com / 123456
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <label>Nome</label>
              <input value={signupNome} onChange={e => setSignupNome(e.target.value)}
                placeholder="Seu nome" required />
            </div>
            <div>
              <label>Email</label>
              <input type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)}
                placeholder="voce@email.com" required />
            </div>
            <div>
              <label>Senha</label>
              <input type="password" value={signupSenha} onChange={e => setSignupSenha(e.target.value)}
                placeholder="••••••" required />
            </div>
            <button type="submit" className="primary" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>
        )}

        {response && <ResponseBox data={response.data} ok={response.ok} />}
      </div>
    </div>
  );
}
