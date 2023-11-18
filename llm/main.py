from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import json
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stream")
async def stream_data():
    async def generate():
        for i in 'This is a test response. I have not uploaded the model yet. Please wait patiently :)'.split(' '):
            yield json.dumps({"value": i}) + "\n"
            time.sleep(0.1)
        yield json.dumps({"value": "<STOP>"})
    return StreamingResponse(generate(), media_type="text/event-stream")