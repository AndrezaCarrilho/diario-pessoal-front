interface ResponseBoxProps {
  data: unknown;
  ok: boolean;
}

export default function ResponseBox({ data, ok }: ResponseBoxProps) {
  if (data === null || data === undefined) return null;
  return (
    <pre style={{
      marginTop: 10,
      padding: "10px 12px",
      borderRadius: 8,
      background: ok ? "#f0fdf4" : "#fef2f2",
      borderLeft: `3px solid ${ok ? "#15803d" : "#b91c1c"}`,
      fontSize: 11,
      fontFamily: "monospace",
      whiteSpace: "pre-wrap",
      wordBreak: "break-all",
      color: ok ? "#14532d" : "#7f1d1d",
      maxHeight: 200,
      overflowY: "auto",
    }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
