function FishIcon({ size = 22 }) {
  // placeholder fish icon (swap for real SVG later)
  return (
    <span
      style={{
        display: "inline-flex",
        width: size,
        height: size,
        borderRadius: "50%",
        border: "2px solid rgba(176,141,87,0.9)",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(176,141,87,0.95)",
        fontWeight: 700,
        lineHeight: 1,
      }}
      title="Baratie"
    >
      魚
    </span>
  );
}

export default function BaratieHeader() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <FishIcon />
      <div style={{ flex: 1 }}>
        <div style={{ color: "#f7e7c6", fontSize: "1.6rem", fontWeight: 800, letterSpacing: "0.08em" }}>
          BARATIE
        </div>
        <div style={{ color: "rgba(247,231,198,0.75)", fontSize: "0.9rem" }}>
          Sanji’s Galley Assistant • recipes, pantry vision, and dish chat
        </div>
      </div>
      <div style={{ color: "rgba(247,231,198,0.75)", fontSize: "0.85rem" }}>
        ⚓
      </div>
    </div>
  );
}
