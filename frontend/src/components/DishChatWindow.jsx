import { styles } from "../styles";
import { useState } from "react";

export default function DishChatWindow({
    recipe,
    messages,
    onSend,
    onClose,
    sending,
}) {
    const [input, setInput] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        const text = input.trim();
        if (!text) return;
        setInput("");
        await onSend(text);
    }

    return (
        <div style={overlayStyles.backdrop}>
            <div style={overlayStyles.window}>
                <div style={overlayStyles.header}>
                    <div>
                        <h2 style={{ margin: 0 }}>{recipe.name}</h2>
                        <p style={overlayStyles.subtitle}>
                            Ask Sanji anything about this dish—substitutions, timing, technique, etc.
                        </p>
                    </div>
                    <button style={overlayStyles.closeButton} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div style={overlayStyles.chatBody}>
                    {messages.length === 0 && (
                        <div style={overlayStyles.systemMsg}>
                            <p>
                                <strong>Sanji:</strong> So you picked <em>{recipe.name}</em>, huh?
                                Nice choice. What do you want to know about it?
                            </p>
                        </div>
                    )}
                    {messages.map((m, idx) => (
                        <div
                            key={idx}
                            style={
                                m.role === "user"
                                    ? overlayStyles.userBubble
                                    : overlayStyles.assistantBubble
                            }
                        >
                            <p style={{ margin: 0 }}>{m.content}</p>
                        </div>
                    ))}
                </div>

                <form style={overlayStyles.inputRow} onSubmit={handleSubmit}>
                    <input
                        style={overlayStyles.input}
                        placeholder="Ask Sanji a question about this dish..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        style={overlayStyles.sendButton}
                        disabled={sending}
                    >
                        {sending ? "..." : "Send"}
                    </button>
                </form>
            </div>
        </div>
    );
}

const overlayStyles = {
    backdrop: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
    },
    window: {
        width: "100%",
        maxWidth: "700px",
        maxHeight: "80vh",
        background: "#020617",
        borderRadius: "1rem",
        border: "1px solid #374151",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
    },
    header: {
        padding: "0.75rem 1rem",
        borderBottom: "1px solid #1f2937",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
    },
    subtitle: {
        margin: 0,
        fontSize: "0.85rem",
        color: "#9ca3af",
    },
    closeButton: {
        border: "none",
        background: "transparent",
        color: "#9ca3af",
        fontSize: "1.2rem",
        cursor: "pointer",
    },
    chatBody: {
        flex: 1,
        padding: "0.75rem 1rem",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
    },
    systemMsg: {
        fontSize: "0.9rem",
        color: "#e5e7eb",
    },
    userBubble: {
        alignSelf: "flex-end",
        background: "#2563eb",
        color: "#f9fafb",
        padding: "0.5rem 0.75rem",
        borderRadius: "1rem",
        maxWidth: "80%",
    },
    assistantBubble: {
        alignSelf: "flex-start",
        background: "#111827",
        color: "#e5e7eb",
        padding: "0.5rem 0.75rem",
        borderRadius: "1rem",
        maxWidth: "80%",
        border: "1px solid #1f2937",
    },
    inputRow: {
        padding: "0.75rem 1rem",
        borderTop: "1px solid #1f2937",
        display: "flex",
        gap: "0.5rem",
    },
    input: {
        flex: 1,
        borderRadius: "9999px",
        border: "1px solid #374151",
        padding: "0.4rem 0.75rem",
        background: "#020617",
        color: "#f9fafb",
    },
    sendButton: {
        padding: "0.4rem 0.9rem",
        borderRadius: "9999px",
        border: "none",
        background: "#22c55e",
        color: "#022c22",
        fontWeight: 600,
        cursor: "pointer",
    },
};
