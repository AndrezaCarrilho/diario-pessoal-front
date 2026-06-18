"use client";
import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | null;
  onDone: () => void;
}

export default function Toast({ message, type, onDone }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!type) return;
    setVisible(true);
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 300); }, 2500);
    return () => clearTimeout(t);
  }, [message, type, onDone]);

  if (!type) return null;

  return (
    <div style={{
      position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 999,
      background: type === "error" ? "#b91c1c" : "#1a1a1a",
      color: "#fff", padding: "9px 16px", borderRadius: 8, fontSize: 13,
      opacity: visible ? 1 : 0, transition: "opacity 0.25s",
      pointerEvents: "none", maxWidth: 320,
    }}>
      {message}
    </div>
  );
}
