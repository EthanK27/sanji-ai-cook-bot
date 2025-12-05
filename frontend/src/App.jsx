import { useState } from "react";

function App() {
  const [ingredientsText, setIngredientsText] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(20);
  const [mood, setMood] = useState("casual dinner alone");
  const [sanjiMode, setSanjiMode] = useState("chill");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [sanjiMood, setSanjiMood] = useState("happy");

  async function handlePantrySubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setRecipes([]);

    const ingredients = ingredientsText
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (ingredients.length === 0) {
      setError("Give Sanji at least one ingredient!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/recipe-from-pantry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients,
          difficulty,
          timeLimitMinutes: Number(timeLimitMinutes),
          mood,
          sanjiMode,
        }),
      });

      if (!res.ok) {
        throw new Error("Sanji slipped in the kitchen. Try again.");
      }

      const data = await res.json();
      setRecipes(data.recipes || []);
      if (data.recipes && data.recipes[0]?.sanjiMood) {
        setSanjiMood(data.recipes[0].sanjiMood);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  // simple mapping from mood to text for now – later you swap to images
  const sanjiMoodText = {
    happy: "😄 Sanji is pleased.",
    annoyed: "😠 Sanji is annoyed by your pantry.",
    flirty: "😍 Sanji turns on the charm.",
    serious: "😐 Sanji is focused.",
  }[sanjiMood] || "🙂 Sanji is listening.";

  return (
    <div style={styles.page}>
      <div style={styles.widget}>
        {/* Sanji header */}
        <div style={styles.header}>
          <div style={styles.sanjiAvatar}>🍽️</div>
          <div>
            <h1 style={styles.title}>Sanji AI Cook Bot</h1>
            <p style={styles.subtitle}>{sanjiMoodText}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handlePantrySubmit} style={styles.form}>
          <label style={styles.label}>
            Ingredients (comma or line separated)
            <textarea
              style={styles.textarea}
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder="chicken, butter, garlic, pasta..."
            />
          </label>

          <div style={styles.row}>
            <label style={styles.labelSmall}>
              Difficulty
              <select
                style={styles.select}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>

            <label style={styles.labelSmall}>
              Time (min)
              <input
                style={styles.input}
                type="number"
                min="5"
                max="180"
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(e.target.value)}
              />
            </label>
          </div>

          <label style={styles.label}>
            Mood / situation
            <input
              style={styles.input}
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="date night, lazy dinner, meal prep..."
            />
          </label>

          <label style={styles.label}>
            Sanji mode
            <select
              style={styles.select}
              value={sanjiMode}
              onChange={(e) => setSanjiMode(e.target.value)}
            >
              <option value="chill">Chill</option>
              <option value="flirty">Flirty</option>
              <option value="serious">Serious</option>
              <option value="annoyed">Annoyed</option>
            </select>
          </label>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Sanji is thinking..." : "Ask Sanji"}
          </button>
        </form>

        {/* Error */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Recipes */}
        <div style={styles.recipes}>
          {recipes.map((r, i) => (
            <div key={i} style={styles.recipeCard}>
              <h2>{r.name}</h2>
              <p>
                ⏱ {r.estimatedTimeMinutes} min • {r.difficulty}
              </p>
              <h3>Ingredients</h3>
              <ul>
                {r.ingredients.map((ing, idx) => (
                  <li key={idx}>
                    {ing.amount ? `${ing.amount} ` : ""}{ing.name}
                  </li>
                ))}
              </ul>
              <h3>Steps</h3>
              <ol>
                {r.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
              <p style={{ fontStyle: "italic", marginTop: "0.5rem" }}>
                {r.sanjiComment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#111827",
    color: "#f9fafb",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    padding: "1rem",
  },
  widget: {
    width: "100%",
    maxWidth: "900px",
    background: "#1f2937",
    borderRadius: "1rem",
    padding: "1.5rem",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
    display: "flex",
    gap: "1.5rem",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
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
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontSize: "0.9rem",
    gap: "0.25rem",
  },
  labelSmall: {
    display: "flex",
    flexDirection: "column",
    fontSize: "0.8rem",
    gap: "0.25rem",
    flex: 1,
  },
  textarea: {
    minHeight: "80px",
    borderRadius: "0.5rem",
    border: "1px solid #374151",
    padding: "0.5rem",
    background: "#030712",
    color: "#f9fafb",
    resize: "vertical",
  },
  input: {
    borderRadius: "0.5rem",
    border: "1px solid #374151",
    padding: "0.4rem 0.5rem",
    background: "#030712",
    color: "#f9fafb",
  },
  select: {
    borderRadius: "0.5rem",
    border: "1px solid #374151",
    padding: "0.4rem 0.5rem",
    background: "#030712",
    color: "#f9fafb",
  },
  row: {
    display: "flex",
    gap: "0.75rem",
  },
  button: {
    marginTop: "0.5rem",
    padding: "0.6rem 1rem",
    borderRadius: "9999px",
    border: "none",
    background: "#f59e0b",
    color: "#111827",
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    color: "#f97373",
    fontSize: "0.9rem",
  },
  recipes: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  recipeCard: {
    padding: "1rem",
    borderRadius: "0.75rem",
    background: "#111827",
    border: "1px solid #374151",
  },
};

export default App;
