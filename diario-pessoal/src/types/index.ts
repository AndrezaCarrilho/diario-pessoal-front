export interface Usuario {
  id: string;
  nome: string;
  email: string;
}

export interface Humor {
  id: string;
  nome: string;
  emoji: string;
}

export interface Caderno {
  id: string;
  titulo: string;
  usuarioId: string;
  criadoEm?: string;
}

export interface Entrada {
  id: string;
  titulo: string;
  conteudo: string;
  cadernoId: string;
  humorId: string;
  usuarioId: string;
  criadoEm?: string;
  humor?: Humor;
  caderno?: Caderno;
}

export interface AuthState {
  user: Usuario | null;
  token: string | null;
}
