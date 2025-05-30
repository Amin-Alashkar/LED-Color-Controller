# server.py
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import httpx
from pydantic import BaseModel

# Replace with your Pi’s IP if different
ANIMATOR_URL = "http://localhost:9000"

app = FastAPI()

# Serve your static www files
app.mount("/", StaticFiles(directory="static", html=True), name="static")

class AnimateRequest(BaseModel):
    animation_type: str
    color_index: int = 0
    hex_color: str = None

@app.post("/animate")
async def animate(req: AnimateRequest):
    async with httpx.AsyncClient() as client:
        if req.animation_type == "light_one_by_one":
            return await client.post(f"{ANIMATOR_URL}/light_one_by_one", json={"index": req.color_index})
        elif req.animation_type == "fade_colors":
            return await client.post(f"{ANIMATOR_URL}/fade_colors")
        else:
            # fallback: solid color
            return await client.post(f"{ANIMATOR_URL}/stop")

@app.post("/color")
async def set_color(req: AnimateRequest):
    # convert hex to the Pi endpoints? for simplicity we just stop animations
    async with httpx.AsyncClient() as client:
        # stop and then set static color directly on your LED strip if you want...
        return await client.post(f"{ANIMATOR_URL}/stop")

@app.post("/stop")
async def stop():
    async with httpx.AsyncClient() as client:
        return await client.post(f"{ANIMATOR_URL}/stop")
