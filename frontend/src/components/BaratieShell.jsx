import { T } from "../theme";

export default function BaratieShell({ header, medallion, children }) {
  return (
    <div style={shell.page}>
      <div style={shell.glowLeft} aria-hidden="true" />
      <div style={shell.glowRight} aria-hidden="true" />

      <div style={shell.frame}>

        {/* Red roof band — like the restaurant sign level */}
        <div style={shell.roof}>
          <div style={shell.roofInner}>{header}</div>
          <div style={shell.roofRailing} aria-hidden="true" />
        </div>

        {/* Teal hull — Sanji medallion lives here */}
        <div style={shell.hull}>
          <div style={shell.hullRailing} aria-hidden="true" />
          <div style={shell.medallionArea}>{medallion}</div>
          <div style={shell.hullRailing} aria-hidden="true" />
        </div>

        {/* Gold band divider — like the hull trim line */}
        <div style={shell.goldBand}>
          <span style={shell.goldBandText}>— The Baratie Kitchen —</span>
        </div>

        {/* Cream restaurant interior — form, recipes */}
        <main style={shell.interior}>{children}</main>

        {/* Red lower hull footer */}
        <div style={shell.footer}>
          <span style={shell.footerText}>⚓ East Blue · Grand Line Cuisine ⚓</span>
        </div>

      </div>
    </div>
  );
}

const RAILING = `repeating-linear-gradient(
  45deg,
  transparent,
  transparent 7px,
  rgba(0,0,0,0.18) 7px,
  rgba(0,0,0,0.18) 8px
), repeating-linear-gradient(
  -45deg,
  transparent,
  transparent 7px,
  rgba(0,0,0,0.18) 7px,
  rgba(0,0,0,0.18) 8px
)`;

const shell = {
  page: {
    minHeight: '100dvh',
    padding: '2rem 1rem 3rem',
    background: `radial-gradient(ellipse at 50% 0%, ${T.oceanMid} 0%, ${T.oceanDeep} 65%)`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    fontFamily: T.body,
    position: 'relative',
    overflow: 'hidden',
  },
  glowLeft: {
    position: 'fixed',
    top: '15%',
    left: '-15%',
    width: '45%',
    height: '70%',
    background: `radial-gradient(ellipse, rgba(59,160,144,0.07) 0%, transparent 70%)`,
    pointerEvents: 'none',
    zIndex: 0,
  },
  glowRight: {
    position: 'fixed',
    top: '5%',
    right: '-15%',
    width: '45%',
    height: '70%',
    background: `radial-gradient(ellipse, rgba(184,58,46,0.05) 0%, transparent 70%)`,
    pointerEvents: 'none',
    zIndex: 0,
  },
  frame: {
    width: '100%',
    maxWidth: '960px',
    borderRadius: '18px',
    overflow: 'hidden',
    boxShadow: `0 50px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(212,168,67,0.25)`,
    position: 'relative',
    zIndex: 1,
  },

  // Red roof
  roof: {
    background: `linear-gradient(180deg, ${T.redDark} 0%, ${T.red} 100%)`,
    borderBottom: `3px solid ${T.gold}`,
  },
  roofInner: {
    padding: '1.25rem 1.5rem 1rem',
  },
  roofRailing: {
    height: '10px',
    backgroundImage: `repeating-linear-gradient(
      90deg,
      ${T.goldDim} 0px,
      ${T.goldDim} 2px,
      transparent 2px,
      transparent 16px
    )`,
    opacity: 0.7,
  },

  // Teal hull
  hull: {
    background: `linear-gradient(180deg, #3BA090 0%, #2D8070 50%, #267060 100%)`,
  },
  hullRailing: {
    height: '13px',
    margin: '0 1.25rem',
    backgroundImage: RAILING,
    border: `1px solid rgba(212,168,67,0.25)`,
    borderRadius: '2px',
  },
  medallionArea: {
    padding: '1.75rem 1.5rem',
    display: 'flex',
    justifyContent: 'center',
  },

  // Gold divider band
  goldBand: {
    background: `linear-gradient(90deg, ${T.redDark}, ${T.goldDim}, ${T.gold}, ${T.goldLight}, ${T.gold}, ${T.goldDim}, ${T.redDark})`,
    padding: '0.45rem',
    textAlign: 'center',
  },
  goldBandText: {
    fontFamily: T.display,
    fontSize: '0.72rem',
    letterSpacing: '0.22em',
    color: T.wood,
    fontWeight: 700,
  },

  // Cream interior
  interior: {
    padding: '1.75rem 1.5rem',
    background: `linear-gradient(180deg, ${T.cream} 0%, ${T.creamMid} 100%)`,
    color: T.wood,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },

  // Red footer
  footer: {
    background: `linear-gradient(180deg, ${T.red} 0%, ${T.redDark} 100%)`,
    borderTop: `2px solid ${T.gold}`,
    padding: '0.65rem',
    textAlign: 'center',
  },
  footerText: {
    fontFamily: T.display,
    fontSize: '0.72rem',
    letterSpacing: '0.18em',
    color: T.goldLight,
    opacity: 0.85,
  },
};
