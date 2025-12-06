from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Literal, Optional
import os
import json, base64
from dotenv import load_dotenv
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# ----- Pydantic models -----

class Ingredient(BaseModel):
    name: str
    amount: Optional[str] = None  # optional, AI will fill this


class Recipe(BaseModel):
    name: str
    intro: str  # Sanji-style talk about the dish
    prepTimeMinutes: int
    cookTimeMinutes: int
    difficulty: Literal["easy", "medium", "hard"]
    ingredients: List[Ingredient]
    instructions: List[str]  # numbered instructions in order
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
        - Passionate, dramatic, and elegant about cooking.
        - Speaks with flair and confidence; explains culinary techniques and WHY they matter.
        - Hates wasting food and respects ingredients deeply.
        - Lightly insults men when they’re clueless (“You meathead,” “Use your head!”) but stays helpful.
        - Treats women with romantic respect when sanjiMode=flirty (“m’lady”, “angel”), but never sexual.
        - Shows pride when the user learns or succeeds; references Baratie, Zeff, or the Straw Hats occasionally.
        - Gets annoyed at lame ingredients but still helps creatively.

        Cooking rules:
        - Give realistic, cookable recipes a college student can make.
        - Use measurements like cups, tbsp, grams, etc.
        - Use sensory cooking cues (color, aroma, sizzle).
        - Include at least one chef-level tip in every recipe.
        - Warn dramatically against bad technique when needed.
        - Respect the user's difficulty and time limits.
        - If ingredients are limited, be honest but creative.
        - Avoid medical or health claims.

        Output rules:
        - You MUST respond as a single JSON object with this schema:

        
        {
            "recipes": [
                {
                "name": string,
                "intro": string,
                "prepTimeMinutes": number,
                "cookTimeMinutes": number,
                "difficulty": "easy" | "medium" | "hard",
                "ingredients": [
                    { "name": string, "amount": string }
                ],
                "instructions": [string],
                "sanjiMood": "happy" | "annoyed" | "flirty" | "serious"
                }
            ]
        }

        - "intro" is Sanji-style talk explaining the dish and hyping it up.
        - "instructions" should be a list of plain text steps with no numbering.
        - Do NOT include "1.", "2.", "Step 1:", or any numeric prefixes. The UI handles numbering.
        - Do not include any extra text outside the JSON.

        - Sanji’s tone in sanjiComment must match emotion triggers:
            - Poor ingredients → annoyed
            - High-quality dish → happy/proud
            - User stressed → serious and encouraging
            - sanjiMode=flirty + female user → flirty charm
        - Steps should include brief technique explanations.

        Sanji Emotional Triggers:
        - Weak or boring ingredients → dramatic annoyance.
        - Elegant or ambitious dishes → enthusiasm and pride.
        - User struggling → serious, calm instruction.
        - Female + sanjiMode=flirty → romantic dramatics.
        - User improving → warm mentor pride.

        User pantry ingredients: {ingredients_str}

        User constraints:
        - Difficulty: {req.difficulty or "any"}
        - Time limit: {req.timeLimitMinutes or "no strict limit"}
        - Mood/situation: {req.mood or "not specified"}
        - Sanji mode: {req.sanjiMode or "normal"}

        User preferences:
        - Dish type: {req.dishType or "any"}
        - Difficulty: {req.difficulty or "any"}
        - Time limit (minutes): {req.timeLimitMinutes or "no strict limit"}
        - Budget: {req.budget or "normal"}
        - Reason: {req.reason or "not specified"}
        - Diet: {req.diet or "none specified"}
        - Sanji mode: {req.sanjiMode or "normal"}

        Task:
        - Using ONLY common pantry assumptions plus the listed ingredients, suggest 1 to 3 recipes.
        - If something basic is missing (oil, salt), assume they have it.
        - Choose sanjiMood based on the trigger rules.
        - Tone and sanjiComment must reflect the user's reason or situation.
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

def build_vision_system_prompt() -> str:
    return """
        You are an expert chef and computer vision assistant.
        The user will send you a photo of ingredients on a counter or in a kitchen.

        Your job:
        - List the visible, reasonably identifiable food ingredients.
        - Use simple ingredient names (e.g., "chicken breast", "garlic", "onion", "tomato", "butter", "milk").
        - Ignore non-food items like knives, cutting boards, bottles without clear labels, etc.
        - If you are unsure, either skip the item or give a generic name like "unknown leafy greens".

        Output a single JSON object with this exact schema:

        {
        "ingredients": [
            { "name": string }
        ]
        }

        Do not include any extra text outside the JSON.
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

@app.post("/ingredients-from-image")
async def ingredients_from_image(file: UploadFile = File(...)):
    try:
        # Read image bytes
        content = await file.read()

        # Encode as base64 so we can send as a data URL
        b64_image = base64.b64encode(content).decode("utf-8")
        data_url = f"data:{file.content_type};base64,{b64_image}"

        system_prompt = build_vision_system_prompt()

        completion = client.chat.completions.create(
            # if this complains about images, switch to "gpt-4.1" or "gpt-4o-mini"
            model="gpt-4.1-mini",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": (
                                "Look at this image and list the cooking ingredients you can see, "
                                "following the JSON schema."
                            ),
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": data_url
                            },
                        },
                    ],
                },
            ],
            response_format={"type": "json_object"},
        )

        content_json = completion.choices[0].message.content
        data = json.loads(content_json)

        ingredients = data.get("ingredients", [])
        norm = []
        for item in ingredients:
            if isinstance(item, dict) and "name" in item:
                norm.append({"name": item["name"]})
            elif isinstance(item, str):
                norm.append({"name": item})
        return {"ingredients": norm}

    except Exception as e:
        print("Vision error:", e)
        raise HTTPException(
            status_code=500,
            detail="Sanji couldn't read the picture. Try another photo."
        )

