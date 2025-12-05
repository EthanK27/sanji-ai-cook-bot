from fastapi import FastAPI
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()  # load variables from .env

app = FastAPI()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class PantryRequest(BaseModel):
    ingredients: list[str]
    difficulty: str | None = None
    timeLimitMinutes: int | None = None
    mood: str | None = None
    sanjiMode: str | None = None


@app.get("/")
def root():
    return {"message": "Sanji backend is running."}


@app.post("/recipe-from-pantry")
def recipe_from_pantry(req: PantryRequest):
    # TODO: build prompt and call OpenAI here
    return {
        "debug": "This is where Sanji will generate recipes.",
        "received": req.dict()
    }
