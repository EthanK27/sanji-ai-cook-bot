import { T } from "../theme";
import imgHappy from "../assets/Sanji-Happy.png";
import imgLove from "../assets/Sanji-Love.png";
import imgAnnoyed from "../assets/Sanji-Annoyed.png";
import imgAngry from "../assets/Sanji-Angry.jpg";
import imgDisgust from "../assets/Sanji-Disgust.png";
import imgGlare from "../assets/Sanji-Glare.png";
import imgMad from "../assets/Sanji-MadFrustrated.png";

const modeImageMap = {
  happy: imgHappy,
  love: imgLove,
  annoyed: imgAnnoyed,
  angry: imgAngry,
  disgust: imgDisgust,
  glare: imgGlare,
  mad: imgMad,
};

export default function SanjiMedallion({ moodText, sanjiMode }) {
  const sanjiImg = modeImageMap[sanjiMode] ?? imgHappy;

  return (
    <div style={med.wrap}>
      {/* Decorative outer shadow ring */}
      <div style={med.shadowRing}>
        {/* Conic gold ring — like a gilded ship medallion */}
        <div style={med.goldRing}>
          {/* Dark deep inner circle */}
          <div style={med.innerCircle}>
            <img src={sanjiImg} alt="Sanji — sous chef of the Baratie" style={med.image} />
          </div>
        </div>
      </div>

      {/* Mood badge below */}
      {moodText && (
        <div style={med.moodBadge}>
          <span style={med.moodText}>{moodText}</span>
        </div>
      )}
    </div>
  );
}

const med = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.9rem',
  },
  shadowRing: {
    width: 256,
    height: 256,
    borderRadius: '50%',
    padding: 5,
    background: 'rgba(0,0,0,0.3)',
    boxShadow: `
      0 0 0 1px rgba(212,168,67,0.2),
      0 28px 56px rgba(0,0,0,0.6),
      0 8px 16px rgba(0,0,0,0.4)
    `,
  },
  goldRing: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: `conic-gradient(
      ${T.goldDim}   0deg,
      ${T.gold}      40deg,
      ${T.goldLight} 80deg,
      ${T.gold}      120deg,
      ${T.goldDim}   160deg,
      ${T.gold}      200deg,
      ${T.goldLight} 240deg,
      ${T.gold}      280deg,
      ${T.goldDim}   320deg,
      ${T.gold}      360deg
    )`,
    padding: 10,
    boxShadow: `inset 0 0 14px rgba(0,0,0,0.5)`,
  },
  innerCircle: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    overflow: 'hidden',
    background: `radial-gradient(circle at 35% 25%, #1B3D55, #05121E)`,
    boxShadow: `inset 0 0 28px rgba(0,0,0,0.7)`,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center top',
    display: 'block',
  },
  moodBadge: {
    background: `rgba(9,30,46,0.55)`,
    border: `1px solid rgba(212,168,67,0.35)`,
    borderRadius: '999px',
    padding: '0.3rem 0.9rem',
    backdropFilter: 'blur(8px)',
  },
  moodText: {
    fontFamily: T.body,
    fontSize: '0.82rem',
    color: T.goldLight,
    letterSpacing: '0.04em',
    fontWeight: 400,
  },
};
