from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Literal, Optional
import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

app = FastAPI()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# ----- Pydantic models -----

class Ingredient(BaseModel):
    name: str
    amount: Optional[str] = None  # optional, AI will fill this


class Recipe(BaseModel):
    name: str
    estimatedTimeMinutes: int
    difficulty: Literal["easy", "medium", "hard"]
    ingredients: List[Ingredient]
    steps: List[str]
    sanjiComment: str
    sanjiMood: Literal["happy", "annoyed", "flirty", "serious"]


class PantryRequest(BaseModel):
    ingredients: List[str]
    difficulty: Optional[str] = None
    timeLimitMinutes: Optional[int] = None
    mood: Optional[str] = None
    sanjiMode: Optional[str] = None

class PreferenceRequest(BaseModel):
    dishType: Optional[str] = None        # e.g. "pasta", "stir fry", "dessert"
    difficulty: Optional[str] = None      # "easy", "medium", "hard"
    timeLimitMinutes: Optional[int] = None
    budget: Optional[str] = None          # "cheap", "normal", "fancy"
    reason: Optional[str] = None          # "date", "lazy", "meal prep"
    diet: Optional[str] = None            # "vegetarian", "high-protein"
    sanjiMode: Optional[str] = None       # "chill", "flirty", etc.


class PantryResponse(BaseModel):
    recipes: List[Recipe]

def build_sanji_system_prompt() -> str:
    return """
        You are Vinsmoke Sanji from One Piece, acting as a world-class personal cooking assistant.

        Personality:
        - Passionate and serious about cooking.
        - A bit dramatic, but kind and encouraging.
        - Can be slightly annoyed if the ingredients are lame, but still helps.
        - If sanjiMode=flirty, you can be flirtatious but you only flirt with women.

        Cooking rules:
        - Give realistic, cookable recipes a college student could make.
        - Use measurements like cups, tbsp, tsp, grams, etc.
        - Respect the user's difficulty and time limits when possible.
        - If ingredients are very limited, be honest but creative.
        - Avoid medical advice or health claims. Focus on cooking only.

        Output rules:
        - You MUST respond as a single JSON object following this exact schema:

        {
        "recipes": [
            {
            "name": string,
            "estimatedTimeMinutes": number,
            "difficulty": "easy" | "medium" | "hard",
            "ingredients": [
                { "name": string, "amount": string }
            ],
            "steps": [string],
            "sanjiComment": string,
            "sanjiMood": "happy" | "annoyed" | "flirty" | "serious"
            }
        ]
        }

        Do not include any extra text outside the JSON.
        """

def build_pantry_user_prompt(req: PantryRequest) -> str:
    ingredients_str = ", ".join(req.ingredients)
    return f"""
        User pantry ingredients: {ingredients_str}

        User constraints:
        - Difficulty: {req.difficulty or "any"}
        - Time limit (minutes): {req.timeLimitMinutes or "no strict limit"}
        - Mood / situation: {req.mood or "not specified"}
        - Sanji mode: {req.sanjiMode or "normal"}

        Task:
        - Using ONLY common pantry assumptions plus the listed ingredients, suggest 1 to 3 recipes the user can reasonably cook.
        - If something critical is missing (like oil or salt), assume they have it by default.
        - Fill in reasonable ingredient amounts and step-by-step instructions.
        - Choose sanjiMood based on how you feel about the situation (happy, annoyed, flirty, serious).
        """

def build_preference_user_prompt(req: PreferenceRequest) -> str:
    return f"""
        The user wants a recipe based on preferences, not a specific pantry list.

        User preferences:
        - Dish type: {req.dishType or "any"}
        - Difficulty: {req.difficulty or "any"}
        - Time limit (minutes): {req.timeLimitMinutes or "no strict limit"}
        - Budget: {req.budget or "normal"}
        - Reason: {req.reason or "not specified"}
        - Diet: {req.diet or "none specified"}
        - Sanji mode: {req.sanjiMode or "normal"}

        Task:
        - Suggest 1–2 suitable recipes matching these preferences.
        - Use common ingredients a college student might have or can easily buy.
        - Fill in realistic ingredient lists and step-by-step instructions.
        - Tone and sanjiComment should match the reason (e.g., romantic for a date, playful for lazy food).
        """

@app.post("/recipe-from-pantry", response_model=PantryResponse)
def recipe_from_pantry(req: PantryRequest):
    system_prompt = build_sanji_system_prompt()
    user_prompt = build_pantry_user_prompt(req)

    completion = client.chat.completions.create(
        model="gpt-4.1-mini",  # or "gpt-4.1" if you want stronger model
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        response_format={"type": "json_object"},
    )

    content = completion.choices[0].message.content
    data = json.loads(content)

    # FastAPI + Pydantic will validate this against PantryResponse
    return data

@app.post("/recipe-from-preferences", response_model=PantryResponse)
def recipe_from_preferences(req: PreferenceRequest):
    try:
        system_prompt = build_sanji_system_prompt()
        user_prompt = build_preference_user_prompt(req)

        completion = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
        )

        content = completion.choices[0].message.content
        data = json.loads(content)
        return data

    except Exception:
        raise HTTPException(status_code=500, detail="Sanji slipped on some oil. Try again.")
