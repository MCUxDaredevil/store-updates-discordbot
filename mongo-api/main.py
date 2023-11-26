from fastapi import FastAPI
from models.App import App

api = FastAPI()


@api.get("/updates")
async def get_updates():
    return {"ok": 1, "message": "Updates retrieved successfully"}


@api.post("/new_app")
async def create_app(name: str, url: str):
    return {"ok": 1, "message": "App created successfully"}
