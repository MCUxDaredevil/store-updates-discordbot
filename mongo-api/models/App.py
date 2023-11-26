from pydantic import BaseModel


class App(BaseModel):
    name: str
    description: str
    version: str
    last_updated: str
    store_url: str


