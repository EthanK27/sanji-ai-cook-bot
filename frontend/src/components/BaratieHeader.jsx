import { T } from "../theme";
import baratielogo from "../assets/baratielogo.png";

export default function BaratieHeader() {
  return (
    <header style={h.wrap}>
      <div style={h.logoRing}>
        <img src={baratielogo} alt="Baratie fish restaurant logo" style={h.logo} />
      </div>

      <div style={h.text}>
        <div style={h.title}>The Baratie</div>
        <div style={h.subtitle}>Sanji's Galley · Recipes, pantry vision & dish chat</div>
      </div>

      <div style={h.anchor} aria-hidden="true">⚓</div>
    </header>
  );
}

const h = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  logoRing: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    border: `2px solid ${T.gold}`,
    overflow: 'hidden',
    flexShrink: 0,
    background: 'rgba(0,0,0,0.25)',
    boxShadow: `0 0 16px rgba(212,168,67,0.4), 0 4px 12px rgba(0,0,0,0.5)`,
  },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: T.display,
    fontSize: '1.9rem',
    fontWeight: 700,
    color: T.goldLight,
    letterSpacing: '0.1em',
    lineHeight: 1.1,
    textShadow: `0 2px 10px rgba(0,0,0,0.6), 0 0 30px rgba(240,192,96,0.2)`,
  },
  subtitle: {
    fontFamily: T.body,
    fontSize: '0.82rem',
    color: 'rgba(245,237,216,0.7)',
    marginTop: '0.25rem',
    letterSpacing: '0.02em',
    fontWeight: 300,
  },
  anchor: {
    fontSize: '1.4rem',
    opacity: 0.6,
    flexShrink: 0,
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
  },
};
