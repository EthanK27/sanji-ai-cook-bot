// src/App.jsx
import { useState } from "react";
import { styles } from "./styles";
import SanjiHeader from "./components/SanjiHeader";
import PantryForm from "./components/PantryForm";
import RecipeList from "./components/RecipeList";
import DishChatWindow from "./components/DishChatWindow";

function App() {
    const [ingredientsText, setIngredientsText] = useState("");
    const [difficulty, setDifficulty] = useState("easy");
    const [timeLimitMinutes, setTimeLimitMinutes] = useState(20);
    const [mood, setMood] = useState("casual dinner alone");
    const [sanjiMode, setSanjiMode] = useState("chill");

    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");

    const [loading, setLoading] = useState(false);
    const [detecting, setDetecting] = useState(false);
    const [error, setError] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [sanjiMood, setSanjiMood] = useState("happy");

    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatSending, setChatSending] = useState(false);


    // ---- Handlers ----

    function handleImageChange(file) {
        setImageFile(file || null);
        if (file) {
            setImagePreviewUrl(URL.createObjectURL(file));
        } else {
            setImagePreviewUrl("");
        }
    }

    async function handleDetectIngredientsFromImage() {
        if (!imageFile) {
            setError("Choose a photo first.");
            return;
        }

        setError("");
        setDetecting(true);

        try {
            const formData = new FormData();
            formData.append("file", imageFile);

            const res = await fetch("http://127.0.0.1:8000/ingredients-from-image", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Sanji couldn't read that image.");
            }

            const data = await res.json();
            const ingNames = (data.ingredients || [])
                .map((i) => i.name)
                .filter(Boolean);

            if (ingNames.length === 0) {
                setError(
                    "Sanji couldn't confidently detect any ingredients. Try a clearer photo."
                );
                return;
            }

            const existing = ingredientsText
                .split(/[,\n]/)
                .map((s) => s.trim())
                .filter((s) => s.length > 0);

            const merged = Array.from(new Set([...existing, ...ingNames]));
            setIngredientsText(merged.join(", "));
        } catch (err) {
            console.error(err);
            setError(err.message || "Something went wrong detecting ingredients.");
        } finally {
            setDetecting(false);
        }
    }

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

    function handleStartChatForRecipe(recipe) {
        setSelectedRecipe(recipe);
        setChatMessages([]); // fresh chat for this dish
    }

    async function handleSendChatMessage(text) {
        if (!selectedRecipe || !text.trim()) return;

        const newUserMessage = { role: "user", content: text.trim() };

        // optimistic update
        const newHistory = [...chatMessages, newUserMessage];
        setChatMessages(newHistory);
        setChatSending(true);
        setError("");

        try {
            const res = await fetch("http://127.0.0.1:8000/dish-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipe: selectedRecipe,
                    history: newHistory,
                    userMessage: text.trim(),
                }),
            });

            if (!res.ok) {
                throw new Error("Sanji couldn't answer right now.");
            }

            const data = await res.json();
            const assistantMessage = { role: "assistant", content: data.reply };

            setChatMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            console.error(err);
            setError(err.message || "Something went wrong in the dish chat.");
        } finally {
            setChatSending(false);
        }
    }

    function handleCloseChat() {
        setSelectedRecipe(null);
        setChatMessages([]);
    }

    const sanjiMoodText = {
        happy: "😄 Sanji is pleased.",
        annoyed: "😠 Sanji is annoyed by your pantry.",
        flirty: "😍 Sanji turns on the charm.",
        serious: "😐 Sanji is focused.",
    }[sanjiMood] || "🙂 Sanji is listening.";

    return (
        <div style={styles.page}>
            <div style={styles.widget}>
                <SanjiHeader sanjiMoodText={sanjiMoodText} />

                <PantryForm
                    ingredientsText={ingredientsText}
                    onIngredientsChange={setIngredientsText}
                    difficulty={difficulty}
                    onDifficultyChange={setDifficulty}
                    timeLimitMinutes={timeLimitMinutes}
                    onTimeLimitChange={setTimeLimitMinutes}
                    mood={mood}
                    onMoodChange={setMood}
                    sanjiMode={sanjiMode}
                    onSanjiModeChange={setSanjiMode}
                    imagePreviewUrl={imagePreviewUrl}
                    onImageChange={handleImageChange}
                    onDetectIngredients={handleDetectIngredientsFromImage}
                    detecting={detecting}
                    loading={loading}
                    onSubmit={handlePantrySubmit}
                />

                {error && <p style={styles.error}>{error}</p>}

                <RecipeList 
                    recipes={recipes}
                    onStartChat={handleStartChatForRecipe}
                />

                {selectedRecipe && (
                    <DishChatWindow
                        recipe={selectedRecipe}
                        messages={chatMessages}
                        onSend={handleSendChatMessage}
                        onClose={handleCloseChat}
                        sending={chatSending}
                    />
                )}

            </div>
        </div>
    );
}

export default App;
