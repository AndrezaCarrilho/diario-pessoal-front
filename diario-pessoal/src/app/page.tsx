"use client";
import { useEffect, useState, useCallback } from "react";
import { Usuario } from "@/types";
import AuthForm from "@/components/AuthForm";
import Sidebar from "@/components/Sidebar";
import Toast from "@/components/Toast";
import DashboardTab from "@/components/DashboardTab";
import CadernosTab from "@/components/CadernosTab";
import EntradasTab from "@/components/EntradasTab";
import HumoresTab from "@/components/HumoresTab";

type Tab = "dashboard" | "cadernos" | "entradas" | "humores";

interface ToastState {
  message: string;
  type: "success" | "error" | null;
}

export default function Home() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [toast, setToast] = useState<ToastState>({ message: "", type: null });

  useEffect(() => {
    const saved = localStorage.getItem("diario_user");
    const token = localStorage.getItem("diario_token");
    if (saved && token) setUser(JSON.parse(saved));
  }, []);

  function handleLogin(u: Usuario) {
    setUser(u);
  }

  function handleLogout() {
    localStorage.removeItem("diario_token");
    localStorage.removeItem("diario_user");
    setUser(null);
  }

  const showToast = useCallback((msg: string, err = false) => {
    setToast({ message: msg, type: err ? "error" : "success" });
  }, []);

  if (!user) return <AuthForm onLogin={handleLogin} />;

  return (
    <>
      <Sidebar
        user={user}
        activeTab={activeTab}
        onTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main style={{ marginLeft: 210, padding: "2rem", minHeight: "100vh" }}>
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "cadernos" && <CadernosTab onToast={showToast} />}
        {activeTab === "entradas" && <EntradasTab onToast={showToast} />}
        {activeTab === "humores" && <HumoresTab onToast={showToast} />}
      </main>

      <Toast
        message={toast.message}
        type={toast.type}
        onDone={() => setToast({ message: "", type: null })}
      />
    </>
  );
}
