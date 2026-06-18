const API_BASE = "https://projeto-aos-diario-pessoal.vercel.app";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("diario_token");
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<{ ok: boolean; data: T; status: number }> {
  const token = getToken();
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data, status: res.status };
}

export const api = {
  // Auth
  signup: (nome: string, email: string, senha: string) =>
    request("POST", "/auth/signup", { nome, email, senha }),
  login: (email: string, senha: string) =>
    request("POST", "/auth/login", { email, senha }),
  logout: () => request("POST", "/auth/logout"),

  // Cadernos
  listarCadernos: () => request("GET", "/cadernos"),
  criarCaderno: (titulo: string) => request("POST", "/cadernos", { titulo }),
  editarCaderno: (id: string, titulo: string) =>
    request("PUT", `/cadernos/${id}`, { titulo }),
  deletarCaderno: (id: string) => request("DELETE", `/cadernos/${id}`),
  entradasDoCaderno: (id: string) => request("GET", `/cadernos/${id}/entradas`),

  // Humores
  listarHumores: () => request("GET", "/humores"),
  criarHumor: (nome: string, emoji: string) =>
    request("POST", "/humores", { nome, emoji }),
  editarHumor: (id: string, nome: string, emoji: string) =>
    request("PUT", `/humores/${id}`, { nome, emoji }),
  deletarHumor: (id: string) => request("DELETE", `/humores/${id}`),

  // Entradas
  listarEntradas: () => request("GET", "/entradas"),
  criarEntrada: (titulo: string, conteudo: string, cadernoId: string, humorId: string) =>
    request("POST", "/entradas", { titulo, conteudo, cadernoId, humorId }),
  editarEntrada: (id: string, titulo: string, conteudo: string, humorId: string) =>
    request("PUT", `/entradas/${id}`, { titulo, conteudo, humorId }),
  deletarEntrada: (id: string) => request("DELETE", `/entradas/${id}`),
};
