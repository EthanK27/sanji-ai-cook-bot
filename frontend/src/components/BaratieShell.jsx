export default function BaratieShell({ header, medallion, children }) {
  return (
    <div style={shell.page}>
      <div style={shell.frame}>
        <div style={shell.header}>{header}</div>
        <div style={shell.center}>{medallion}</div>
        <div style={shell.content}>{children}</div>
      </div>
    </div>
  );
}

const shell = {
  page: {
    minHeight: "100vh",
    padding: "2rem 1rem",
    background: "linear-gradient(180deg, #0b1b2b 0%, #1a0f0a 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
  },
  frame: {
    width: "100%",
    maxWidth: "980px",
    borderRadius: "24px",
    background: "rgba(15, 23, 42, 0.35)",
    border: "1px solid rgba(176, 141, 87, 0.35)",
    boxShadow: "0 30px 60px rgba(0,0,0,0.55)",
    overflow: "hidden",
  },
  header: {
    padding: "1.25rem 1.25rem 0.75rem",
    borderBottom: "1px solid rgba(176, 141, 87, 0.25)",
    background:
      "linear-gradient(90deg, rgba(58,38,24,0.85) 0%, rgba(11,27,43,0.65) 70%)",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    padding: "1.25rem",
  },
  content: {
    padding: "1.25rem",
    background: "linear-gradient(180deg, rgba(242,231,210,0.95), rgba(242,231,210,0.9))",
  },
};
