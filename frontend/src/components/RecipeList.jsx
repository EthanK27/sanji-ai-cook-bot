import { T } from "../theme";

export default function RecipeList({ recipes, onStartChat }) {
  if (!recipes || recipes.length === 0) return null;

  return (
    <section>
      <div style={r.sectionTitle}>Tonight's Menu</div>
      <div style={r.container}>
        {recipes.map((recipe, i) => (
          <article key={i} style={r.card}>
            <div style={r.cardHeader}>
              <h2 style={r.recipeName}>{recipe.name}</h2>
              <div style={r.metaRow}>
                <span style={r.metaBadge}>⏱ {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
                <span style={r.metaBadge}>{recipe.difficulty}</span>
              </div>
            </div>

            <p style={r.intro}>{recipe.intro}</p>

            <div style={r.divider} />

            <h3 style={r.subheading}>Ingredients</h3>
            <ul style={r.list}>
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} style={r.listItem}>
                  <span style={r.bullet}>·</span>
                  {ing.amount ? `${ing.amount} ` : ""}{ing.name}
                </li>
              ))}
            </ul>

            <h3 style={r.subheading}>Instructions</h3>
            <ol style={r.orderedList}>
              {recipe.instructions.map((step, idx) => (
                <li key={idx} style={r.orderedItem}>{step}</li>
              ))}
            </ol>

            <button
              type="button"
              style={r.chatButton}
              onClick={() => onStartChat && onStartChat(recipe)}
            >
              Chat with Sanji about this dish
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

const r = {
  sectionTitle: {
    fontFamily: T.display,
    fontSize: '1.1rem',
    fontWeight: 700,
    color: T.red,
    letterSpacing: '0.1em',
    borderBottom: `2px solid ${T.creamDark}`,
    paddingBottom: '0.5rem',
    marginBottom: '1rem',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  card: {
    background: T.cream,
    border: `1px solid ${T.creamDark}`,
    borderTop: `3px solid ${T.teal}`,
    borderRadius: '12px',
    padding: '1.25rem 1.4rem',
    boxShadow: `0 4px 16px rgba(61,32,16,0.08)`,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  recipeName: {
    fontFamily: T.display,
    fontSize: '1.25rem',
    fontWeight: 700,
    color: T.wood,
    letterSpacing: '0.04em',
    margin: 0,
    flex: 1,
  },
  metaRow: {
    display: 'flex',
    gap: '0.5rem',
    flexShrink: 0,
  },
  metaBadge: {
    fontFamily: T.body,
    fontSize: '0.75rem',
    fontWeight: 700,
    color: T.tealDark,
    background: `rgba(59,160,144,0.12)`,
    border: `1px solid rgba(59,160,144,0.3)`,
    borderRadius: '4px',
    padding: '0.2rem 0.5rem',
    letterSpacing: '0.03em',
    textTransform: 'capitalize',
  },
  intro: {
    fontFamily: T.body,
    fontSize: '0.9rem',
    fontStyle: 'italic',
    color: T.woodLight,
    lineHeight: 1.6,
    margin: 0,
    textWrap: 'pretty',
  },
  divider: {
    height: '1px',
    background: T.creamDark,
    margin: '0.25rem 0',
  },
  subheading: {
    fontFamily: T.display,
    fontSize: '0.8rem',
    fontWeight: 600,
    color: T.red,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    margin: 0,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  listItem: {
    fontFamily: T.body,
    fontSize: '0.88rem',
    color: T.ink,
    display: 'flex',
    gap: '0.4rem',
    alignItems: 'baseline',
  },
  bullet: {
    color: T.teal,
    fontWeight: 700,
    flexShrink: 0,
  },
  orderedList: {
    paddingLeft: '1.25rem',
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  orderedItem: {
    fontFamily: T.body,
    fontSize: '0.88rem',
    color: T.ink,
    lineHeight: 1.55,
  },
  chatButton: {
    marginTop: '0.25rem',
    padding: '0.55rem 1.2rem',
    borderRadius: '999px',
    border: `1px solid ${T.teal}`,
    background: `linear-gradient(135deg, ${T.tealDark} 0%, ${T.teal} 100%)`,
    color: T.cream,
    fontFamily: T.display,
    fontSize: '0.8rem',
    fontWeight: 600,
    letterSpacing: '0.06em',
    cursor: 'pointer',
    alignSelf: 'flex-start',
    boxShadow: `0 3px 10px rgba(42,115,105,0.3)`,
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
};
