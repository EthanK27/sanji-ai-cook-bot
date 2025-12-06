import { styles } from "../styles";

export default function PantryForm({
    ingredientsText,
    onIngredientsChange,
    difficulty,
    onDifficultyChange,
    timeLimitMinutes,
    onTimeLimitChange,
    mood,
    onMoodChange,
    sanjiMode,
    onSanjiModeChange,
    imagePreviewUrl,
    onImageChange,
    onDetectIngredients,
    detecting,
    loading,
    onSubmit,
}) {
    return (
        <form onSubmit={onSubmit} style={formStyles.form}>
            {/* Image upload */}
            <label style={formStyles.label}>
                Ingredient photo (optional)
                <input
                    type="file"
                    accept="image/*"
                    style={formStyles.input}
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        onImageChange(file);
                    }}
                />
            </label>

            {imagePreviewUrl && (
                <div style={{ marginBottom: "0.5rem" }}>
                    <img
                        src={imagePreviewUrl}
                        alt="Selected ingredients"
                        style={{
                            maxWidth: "100%",
                            borderRadius: "0.5rem",
                            border: "1px solid #374151",
                        }}
                    />
                    <button
                        type="button"
                        style={{
                            ...formStyles.button,
                            marginTop: "0.5rem",
                            padding: "0.4rem 0.8rem",
                        }}
                        onClick={onDetectIngredients}
                        disabled={detecting}
                    >
                        {detecting ? "Sanji is inspecting..." : "Detect ingredients from image"}
                    </button>
                </div>
            )}

            {/* Ingredients textarea */}
            <label style={formStyles.label}>
                Ingredients (comma or line separated)
                <textarea
                    style={formStyles.textarea}
                    value={ingredientsText}
                    onChange={(e) => onIngredientsChange(e.target.value)}
                    placeholder="chicken, butter, garlic, pasta..."
                />
            </label>

            {/* Difficulty + time */}
            <div style={formStyles.row}>
                <label style={formStyles.labelSmall}>
                    Difficulty
                    <select
                        style={formStyles.select}
                        value={difficulty}
                        onChange={(e) => onDifficultyChange(e.target.value)}
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </label>

                <label style={formStyles.labelSmall}>
                    Time (min)
                    <input
                        style={formStyles.input}
                        type="number"
                        min="5"
                        max="180"
                        value={timeLimitMinutes}
                        onChange={(e) => onTimeLimitChange(e.target.value)}
                    />
                </label>
            </div>

            {/* Mood / situation */}
            <label style={formStyles.label}>
                Mood / situation
                <input
                    style={formStyles.input}
                    value={mood}
                    onChange={(e) => onMoodChange(e.target.value)}
                    placeholder="date night, lazy dinner, meal prep..."
                />
            </label>

            {/* Sanji mode */}
            <label style={formStyles.label}>
                Sanji mode
                <select
                    style={formStyles.select}
                    value={sanjiMode}
                    onChange={(e) => onSanjiModeChange(e.target.value)}
                >
                    <option value="chill">Chill</option>
                    <option value="flirty">Flirty</option>
                    <option value="serious">Serious</option>
                    <option value="annoyed">Annoyed</option>
                </select>
            </label>

            <button style={formStyles.button} type="submit" disabled={loading}>
                {loading ? "Sanji is thinking..." : "Ask Sanji"}
            </button>
        </form>
    );
}

const formStyles = {
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
};
