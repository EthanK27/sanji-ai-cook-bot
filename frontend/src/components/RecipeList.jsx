import { styles } from "../styles";

export default function RecipeList({ recipes, onStartChat }) {
    if (!recipes || recipes.length === 0) return null;

    return (
        <div style={listStyles.container}>
            {recipes.map((r, i) => (
                <div key={i} style={listStyles.card}>
                    <h2>{r.name}</h2>

                    <p style={listStyles.intro}>{r.intro}</p>

                    <p>
                        <strong>Prep Time:</strong> {r.prepTimeMinutes} minutes
                    </p>
                    <p>
                        <strong>Cook Time:</strong> {r.cookTimeMinutes} minutes
                    </p>
                    <p>
                        <strong>Difficulty:</strong> {r.difficulty}
                    </p>

                    <h3 style={listStyles.sectionTitle}>Ingredients:</h3>
                    <ul>
                        {r.ingredients.map((ing, idx) => (
                            <li key={idx}>
                                {ing.amount ? `${ing.amount} ` : ""}
                                {ing.name}
                            </li>
                        ))}
                    </ul>

                    <h3 style={listStyles.sectionTitle}>Instructions:</h3>
                    <ol>
                        {r.instructions.map((step, idx) => (
                            <li key={idx}>{step}</li>
                        ))}
                    </ol>

                    <button
                        type="button"
                        style={listStyles.chatButton}
                        onClick={() => onStartChat && onStartChat(r)}
                    >
                        Chat with Sanji about this dish
                    </button>
                </div>
            ))}
        </div>
    );
}

const listStyles = {
    container: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    },
    card: {
        padding: "1rem",
        borderRadius: "0.75rem",
        background: "#111827",
        border: "1px solid #374151",
    },
    intro: {
        fontStyle: "italic",
        marginBottom: "0.75rem",
    },
    sectionTitle: {
        marginTop: "0.75rem",
    },
    chatButton: {
        marginTop: "0.75rem",
        padding: "0.4rem 0.8rem",
        borderRadius: "9999px",
        border: "none",
        background: "#3b82f6",
        color: "#f9fafb",
        fontWeight: 500,
        cursor: "pointer",
    },
};
