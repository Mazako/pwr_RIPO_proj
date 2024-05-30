from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ripo.app.analyze_router import analyze_router
from ripo.app.config_router import config_router
from ripo.app.config_service import load_config, write_config

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

app.include_router(router=config_router)
app.include_router(router=analyze_router)


@app.on_event(event_type='startup')
def on_start():
    print('LOADING CONFIGURATION')
    load_config()


@app.on_event(event_type='shutdown')
def on_shut():
    print('SAVING CONFIGURATION')
    write_config()
