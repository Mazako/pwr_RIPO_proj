import os
import uuid
from typing import Optional
import json

from fastapi import FastAPI, UploadFile, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import FileResponse, Response

from model import MaskPosition
from ripo.video_analyzer import model_predictor

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tasks = {}


def process_video(_id: str, src: str, dest: str, mask: Optional[MaskPosition] = None):
    def on_progress(current, total):
        tasks[_id]['progress'] = (current / total) * 100

    model_predictor.predict_video(src, dest, on_progress, mask)
    tasks[_id]['done'] = True
    os.remove(src)


@app.get('/getVideo', response_class=FileResponse)
async def get_image(video_id: str):
    path = tasks.get(video_id)['path']
    return FileResponse(path, status_code=200, media_type='video/mp4')


@app.post('/analyze')
async def analyze(video: UploadFile, background_tasks: BackgroundTasks, mask: Optional[str] = None):
    _id = str(uuid.uuid4())
    input_path = f'../../../images/inputs/{video.filename}'
    output_path = f'../../../images/outputs/{_id}.mp4'

    with open(input_path, 'wb') as file:
        file.write(video.file.read())

    tasks[_id] = {
        'progress': 0,
        'done': False,
        'path': output_path
    }
    print(mask)
    if mask is not None:
        mask = json.loads(mask)
        mask_model = MaskPosition(**mask)
    else:
        mask_model = None

    background_tasks.add_task(process_video,
                              str(_id),
                              input_path,
                              output_path,
                              mask_model)
    return {'id': _id}


@app.get('/ready')
def is_image_ready(video_id: str):
    return {
        'ready': tasks.get(video_id)['done'] is True,
        'progress': tasks.get(video_id)['progress']
    }
