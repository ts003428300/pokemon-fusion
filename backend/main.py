from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
import base64
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize client
# We will initialize client dynamically in the endpoint to support key updates
def get_client():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return None
    return genai.Client(api_key=api_key)

class FusionRequest(BaseModel):
    p1: str
    p2: str

class ApiKeyRequest(BaseModel):
    api_key: str

@app.get("/api/check-key")
async def check_key():
    api_key = os.environ.get("GEMINI_API_KEY")
    return {"has_key": bool(api_key)}

@app.post("/api/set-key")
async def set_key(request: ApiKeyRequest):
    # Update .env file
    env_path = ".env"
    with open(env_path, "w") as f:
        f.write(f"GEMINI_API_KEY={request.api_key}\n")
    
    # Reload environment variable
    os.environ["GEMINI_API_KEY"] = request.api_key
    
    return {"status": "success"}

@app.post("/api/fuse")
async def fuse_pokemon(request: FusionRequest):
    client = get_client()
    if not client:
        raise HTTPException(status_code=401, detail="API Key not set")

    print(f"Fusing {request.p1} and {request.p2}...")
    prompt = (
        f"A fusion of Pokemon {request.p1} and {request.p2}. "
        f"The design must seamlessly combine features of both creatures. "
        f"Art style: Official Pokemon Generation 1 style, Ken Sugimori 1996 artwork. "
        f"Vintage anime aesthetic, cel shading, slightly desaturated colors. "
        f"White background. Full body shot. No 3D rendering, no modern digital art style."
    )
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=[prompt],
        )
        
        for part in response.parts:
            if part.inline_data is not None:
                # Convert to base64
                # The part.inline_data.data is bytes
                b64_image = base64.b64encode(part.inline_data.data).decode('utf-8')
                return {"image": b64_image}
                
        raise HTTPException(status_code=500, detail="No image generated")
    except Exception as e:
        print(f"Error generating image: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
