import { styles } from "../styles";

export default function SanjiHeader({ sanjiMoodText }) {
  return (
    <div style={headerStyles.container}>
      <div style={headerStyles.sanjiAvatar}>🍽️</div>
      <div>
        <h1 style={headerStyles.title}>Sanji AI Cook Bot</h1>
        <p style={headerStyles.subtitle}>{sanjiMoodText}</p>
      </div>
    </div>
  );
}

const headerStyles = {
  container: {
    ...styles.header,
  },
  sanjiAvatar: {
    width: "3rem",
    height: "3rem",
    borderRadius: "9999px",
    background: "#111827",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
  },
  title: {
    margin: 0,
    fontSize: "1.4rem",
  },
  subtitle: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#9ca3af",
  },
};
