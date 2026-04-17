import { T } from "../theme";

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
    <form onSubmit={onSubmit} style={f.form}>

      <div style={f.sectionTitle}>Your Pantry</div>

      {/* Image upload */}
      <label style={f.label}>
        <span style={f.labelText}>Ingredient photo <span style={f.optional}>(optional)</span></span>
        <input
          type="file"
          accept="image/*"
          style={f.fileInput}
          onChange={(e) => onImageChange(e.target.files?.[0] || null)}
        />
      </label>

      {imagePreviewUrl && (
        <div style={f.previewWrap}>
          <img
            src={imagePreviewUrl}
            alt="Selected ingredient photo"
            style={f.previewImage}
          />
          <button
            type="button"
            style={f.detectButton}
            onClick={onDetectIngredients}
            disabled={detecting}
          >
            {detecting ? "Sanji is inspecting…" : "Detect ingredients from photo"}
          </button>
        </div>
      )}

      {/* Ingredients */}
      <label style={f.label}>
        <span style={f.labelText}>Ingredients <span style={f.hint}>comma or line separated</span></span>
        <textarea
          style={f.textarea}
          value={ingredientsText}
          onChange={(e) => onIngredientsChange(e.target.value)}
          placeholder="chicken, butter, garlic, pasta…"
        />
      </label>

      {/* Difficulty + time row */}
      <div style={f.row}>
        <label style={f.labelSmall}>
          <span style={f.labelText}>Difficulty</span>
          <select
            style={f.select}
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        <label style={f.labelSmall}>
          <span style={f.labelText}>Time (min)</span>
          <input
            style={f.input}
            type="number"
            min="5"
            max="180"
            value={timeLimitMinutes}
            onChange={(e) => onTimeLimitChange(e.target.value)}
          />
        </label>
      </div>

      {/* Mood */}
      <label style={f.label}>
        <span style={f.labelText}>Mood / situation</span>
        <input
          style={f.input}
          value={mood}
          onChange={(e) => onMoodChange(e.target.value)}
          placeholder="date night, lazy dinner, meal prep…"
        />
      </label>

      {/* Sanji mode */}
      <label style={f.label}>
        <span style={f.labelText}>Sanji mode</span>
        <select
          style={f.select}
          value={sanjiMode}
          onChange={(e) => onSanjiModeChange(e.target.value)}
        >
          <option value="happy">Happy / Chill</option>
          <option value="love">Romantic / Flirty</option>
          <option value="annoyed">Annoyed</option>
          <option value="angry">Angry</option>
          <option value="disgust">Disgusted</option>
          <option value="glare">Intense / Focused</option>
          <option value="mad">Mad / Frustrated</option>
        </select>
      </label>

      <button
        type="submit"
        style={loading ? { ...f.submitButton, ...f.submitDisabled } : f.submitButton}
        disabled={loading}
      >
        {loading ? "Sanji is thinking…" : "Ask Sanji"}
      </button>

    </form>
  );
}

const BORDER = `1px solid rgba(59,160,144,0.35)`;

const f = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
  },
  sectionTitle: {
    fontFamily: T.display,
    fontSize: '1.1rem',
    fontWeight: 700,
    color: T.red,
    letterSpacing: '0.1em',
    borderBottom: `2px solid ${T.creamDark}`,
    paddingBottom: '0.5rem',
    marginBottom: '0.25rem',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  labelSmall: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    flex: 1,
  },
  labelText: {
    fontFamily: T.body,
    fontSize: '0.82rem',
    fontWeight: 700,
    color: T.woodLight,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  },
  optional: {
    fontWeight: 400,
    textTransform: 'none',
    opacity: 0.65,
    fontSize: '0.78rem',
  },
  hint: {
    fontWeight: 400,
    textTransform: 'none',
    opacity: 0.6,
    fontSize: '0.78rem',
  },
  textarea: {
    minHeight: '85px',
    borderRadius: '8px',
    border: BORDER,
    padding: '0.6rem 0.75rem',
    background: T.cream,
    color: T.ink,
    resize: 'vertical',
    fontFamily: T.body,
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  input: {
    borderRadius: '8px',
    border: BORDER,
    padding: '0.5rem 0.75rem',
    background: T.cream,
    color: T.ink,
    fontFamily: T.body,
    fontSize: '0.9rem',
    outline: 'none',
    width: '100%',
  },
  select: {
    borderRadius: '8px',
    border: BORDER,
    padding: '0.5rem 0.75rem',
    background: T.cream,
    color: T.ink,
    fontFamily: T.body,
    fontSize: '0.9rem',
    outline: 'none',
    width: '100%',
    cursor: 'pointer',
    appearance: 'auto',
  },
  row: {
    display: 'flex',
    gap: '0.75rem',
  },
  fileInput: {
    borderRadius: '8px',
    border: BORDER,
    padding: '0.45rem 0.65rem',
    background: T.cream,
    color: T.woodLight,
    fontFamily: T.body,
    fontSize: '0.85rem',
    cursor: 'pointer',
    width: '100%',
  },
  previewWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  previewImage: {
    maxWidth: '100%',
    maxHeight: '200px',
    objectFit: 'contain',
    borderRadius: '10px',
    border: `1px solid ${T.creamDark}`,
  },
  detectButton: {
    padding: '0.5rem 1rem',
    borderRadius: '999px',
    border: `1px solid ${T.teal}`,
    background: 'transparent',
    color: T.tealDark,
    fontFamily: T.body,
    fontSize: '0.85rem',
    fontWeight: 700,
    cursor: 'pointer',
    alignSelf: 'flex-start',
    transition: 'background 0.2s, color 0.2s',
  },
  submitButton: {
    marginTop: '0.5rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '999px',
    border: 'none',
    background: `linear-gradient(135deg, ${T.red} 0%, ${T.redLight} 100%)`,
    color: T.goldLight,
    fontFamily: T.display,
    fontSize: '0.95rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    cursor: 'pointer',
    boxShadow: `0 4px 14px rgba(184,58,46,0.4)`,
    transition: 'transform 0.15s, box-shadow 0.15s',
    alignSelf: 'flex-start',
  },
  submitDisabled: {
    opacity: 0.65,
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none',
  },
};
