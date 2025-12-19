import sanjiImg from "../assets/sanji-test.jpg";

export default function SanjiMedallion({ moodText }) {
    return (
        <div style={med.wrap}>
            <div style={med.ring}>
                <div style={med.inner}>
                    {/* later: replace with a Sanji sprite image */}
                    <img
                        src={sanjiImg}
                        alt="Sanji"
                        style={med.image}
                    />
                </div>
            </div>
        </div>
    );
}

const med = {
    wrap: { display: "flex", justifyContent: "center" },
    ring: {
        width: 240,
        height: 240,
        borderRadius: "50%",
        background: "radial-gradient(circle at 30% 30%, rgba(176,141,87,1), rgba(90,65,35,1))",
        padding: 10,
        boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
    },
    inner: {
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        background: "radial-gradient(circle at 30% 20%, #0b1b2b, #020617)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,              // ⬅️ spacing lives here now
        boxShadow:
            "inset 0 0 40px rgba(0,0,0,0.7), inset 0 0 8px rgba(255,255,255,0.05)",
    },

    name: { fontSize: "1.25rem", fontWeight: 800, letterSpacing: "0.06em" },
    mood: { fontSize: "0.85rem", opacity: 0.85 },
    placeholder: { fontSize: "2.2rem", marginTop: "0.2rem" },
    image: {
        width: "100%",          // ⬅️ key change
        height: "100%",
        borderRadius: "50%",
        objectFit: "cover",
        objectPosition: "center",
        border: "2px solid rgba(176,141,87,0.55)",
        boxShadow: "0 12px 22px rgba(0,0,0,0.6)",
    },



};
