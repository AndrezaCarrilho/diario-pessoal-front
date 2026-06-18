import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diário Pessoal",
  description: "Frontend de teste da API de diário pessoal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
