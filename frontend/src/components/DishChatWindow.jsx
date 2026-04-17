import { T } from "../theme";
import { useState } from "react";

export default function DishChatWindow({ recipe, messages, onSend, onClose, sending }) {
  const [input, setInput] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    await onSend(text);
  }

  return (
    <div style={w.backdrop}>
      <div style={w.window}>

        {/* Header — red roof band */}
        <div style={w.header}>
          <div style={w.headerText}>
            <div style={w.headerTitle}>{recipe.name}</div>
            <div style={w.headerSub}>Ask Sanji about substitutions, timing, technique…</div>
          </div>
          <button style={w.closeButton} onClick={onClose} aria-label="Close chat">✕</button>
        </div>

        {/* Gold divider */}
        <div style={w.goldBar} />

        {/* Chat body */}
        <div style={w.chatBody}>
          {messages.length === 0 && (
            <div style={w.systemMsg}>
              <span style={w.senderLabel}>Sanji</span>
              <p style={w.systemText}>
                So you picked <em>{recipe.name}</em>, huh? Nice choice.
                What do you want to know about it?
              </p>
            </div>
          )}
          {messages.map((m, idx) => (
            <div key={idx} style={m.role === "user" ? w.userBubble : w.assistantBubbleWrap}>
              {m.role === "assistant" && <span style={w.senderLabel}>Sanji</span>}
              <div style={m.role === "user" ? w.userBubbleInner : w.assistantBubble}>
                <p style={{ margin: 0 }}>{m.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input row */}
        <form style={w.inputRow} onSubmit={handleSubmit}>
          <input
            style={w.input}
            placeholder="Ask Sanji a question about this dish…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" style={sending ? { ...w.sendButton, opacity: 0.6 } : w.sendButton} disabled={sending}>
            {sending ? "…" : "Send"}
          </button>
        </form>

      </div>
    </div>
  );
}

const w = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(9,30,46,0.75)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
    padding: '1rem',
  },
  window: {
    width: '100%',
    maxWidth: '680px',
    maxHeight: '82vh',
    background: `linear-gradient(180deg, #0F3347 0%, #091E2E 100%)`,
    borderRadius: '16px',
    border: `1px solid rgba(212,168,67,0.3)`,
    boxShadow: `0 32px 64px rgba(0,0,0,0.7)`,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    padding: '1rem 1.25rem',
    background: `linear-gradient(180deg, ${T.redDark} 0%, ${T.red} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  headerTitle: {
    fontFamily: T.display,
    fontSize: '1.15rem',
    fontWeight: 700,
    color: T.goldLight,
    letterSpacing: '0.06em',
    lineHeight: 1.2,
  },
  headerSub: {
    fontFamily: T.body,
    fontSize: '0.78rem',
    color: 'rgba(245,237,216,0.65)',
    marginTop: '0.2rem',
    fontWeight: 300,
  },
  closeButton: {
    border: 'none',
    background: 'rgba(0,0,0,0.2)',
    color: 'rgba(245,237,216,0.7)',
    fontSize: '1rem',
    cursor: 'pointer',
    width: 32,
    height: 32,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background 0.2s',
  },
  goldBar: {
    height: '3px',
    background: `linear-gradient(90deg, ${T.redDark}, ${T.gold}, ${T.goldLight}, ${T.gold}, ${T.redDark})`,
  },
  chatBody: {
    flex: 1,
    padding: '1rem 1.25rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  systemMsg: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    alignSelf: 'flex-start',
    maxWidth: '82%',
  },
  systemText: {
    fontFamily: T.body,
    fontSize: '0.88rem',
    color: `rgba(245,237,216,0.85)`,
    background: `rgba(59,160,144,0.12)`,
    border: `1px solid rgba(59,160,144,0.25)`,
    borderRadius: '0 12px 12px 12px',
    padding: '0.6rem 0.85rem',
    lineHeight: 1.55,
    margin: 0,
  },
  senderLabel: {
    fontFamily: T.display,
    fontSize: '0.68rem',
    fontWeight: 600,
    color: T.tealLight,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    paddingLeft: '0.25rem',
  },
  userBubble: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    maxWidth: '82%',
  },
  userBubbleInner: {
    fontFamily: T.body,
    fontSize: '0.88rem',
    color: T.cream,
    background: `linear-gradient(135deg, ${T.tealDark}, ${T.teal})`,
    borderRadius: '12px 12px 0 12px',
    padding: '0.6rem 0.85rem',
    lineHeight: 1.55,
    boxShadow: `0 2px 8px rgba(0,0,0,0.3)`,
  },
  assistantBubbleWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    alignSelf: 'flex-start',
    maxWidth: '82%',
  },
  assistantBubble: {
    fontFamily: T.body,
    fontSize: '0.88rem',
    color: 'rgba(245,237,216,0.9)',
    background: `rgba(59,160,144,0.1)`,
    border: `1px solid rgba(59,160,144,0.2)`,
    borderRadius: '0 12px 12px 12px',
    padding: '0.6rem 0.85rem',
    lineHeight: 1.55,
  },
  inputRow: {
    padding: '0.85rem 1.25rem',
    borderTop: `1px solid rgba(212,168,67,0.2)`,
    display: 'flex',
    gap: '0.6rem',
    background: 'rgba(0,0,0,0.2)',
  },
  input: {
    flex: 1,
    borderRadius: '999px',
    border: `1px solid rgba(59,160,144,0.35)`,
    padding: '0.5rem 0.9rem',
    background: `rgba(15,51,71,0.8)`,
    color: T.cream,
    fontFamily: T.body,
    fontSize: '0.88rem',
    outline: 'none',
  },
  sendButton: {
    padding: '0.5rem 1.1rem',
    borderRadius: '999px',
    border: 'none',
    background: `linear-gradient(135deg, ${T.tealDark}, ${T.teal})`,
    color: T.cream,
    fontFamily: T.display,
    fontSize: '0.8rem',
    fontWeight: 600,
    letterSpacing: '0.06em',
    cursor: 'pointer',
    transition: 'transform 0.15s',
    flexShrink: 0,
  },
};
