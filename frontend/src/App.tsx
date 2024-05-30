import React, {ChangeEvent, useState} from 'react';
import {Button, ProgressBar} from "react-bootstrap";
import {VideoUploader} from "./VideoUploader";
import {Position} from "./MaskRectangle";
import {ConfigModal} from "./ConfigModal";

function App() {
    const [position, setPosition] = useState<Position>({
        x: 10,
        y: 10,
        width: 100,
        height: 100
    });

    const [showMask, setShowMask] = useState<boolean>(false);
    const [showConfig, setShowConfig] = useState<boolean>(false);
    const [videoState, setVideoState] = useState<VideoState>('none');
    const [video, setVideo] = useState<File>();
    const [videoUrl, setVideoUrl] = useState<string>();
    const [videoId, setVideoId] = useState<string>();
    const [progress, setProgress] = useState<number>(0);

    const checkVideoAvailable = async (id: string) => {
        console.log(`http://localhost:8000/ready?video_id=${id}`);
        const response = await fetch(`http://localhost:8000/ready?video_id=${id}`);
        const json = await response.json();
        setProgress(Number(json['progress']));
        return Boolean(json['ready']);
    };


    const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setVideo(e.target.files[0]);
        }
    };

    const handleVideoSend = async () => {
        const data = new FormData();
        // @ts-ignore
        data.set('video', video);
        let url = 'http://localhost:8000/analyze';
        if (showMask) {
            url = `http://localhost:8000/analyze?mask=${JSON.stringify(position)}`;
        }
        const response = await fetch(url, {
            method: 'POST',
            body: data,
        });
        setVideoState('analyzing');
        const json = await response.json();
        const id = json['id'];
        setVideoId(id);
        const inrervalId = setInterval(async () => {
            const available = await checkVideoAvailable(id);
            console.log(available);
            if (available) {
                setVideoUrl(`http://localhost:8000/getVideo?video_id=${id}`);
                setVideoState('done');
                clearInterval(inrervalId);
            }
        }, 1000);
    };

    return (
        <div className="d-flex flex-column align-items-center gap-3">
            <h1 className="display-1">Analizuj se filmosa d-_-b</h1>
            <input type="file"
                   title="Wybierz plik"
                   onChange={handleVideoChange}
            />
            <div className="d-flex gap-5">
                <Button disabled={!video} onClick={handleVideoSend}>Analizuj</Button>
                <Button disabled={!video} onClick={() => setShowMask(!showMask)}>
                    {
                        showMask
                            ? 'Usuń maskę'
                            : 'Nałóż maskę'
                    }
                </Button>
                <Button onClick={() => setShowConfig(true)}>
                    Konfiguracja
                </Button>
            </div>
            <ConfigModal show={showConfig}
                         closeCallback={() => setShowConfig(false)}/>
            {
                video && videoState === 'none'
                &&
                <VideoUploader file={video} maskPosition={position} setMaskPosition={setPosition} showMask={showMask}/>
            }
            {
                videoState === 'analyzing'
                &&
                <div className="w-100">
                    <ProgressBar now={progress}/>
                </div>
            }
            {
                videoState === 'done'
                &&
                <video autoPlay controls>
                    <source src={videoUrl} type="video/mp4"/>
                </video>
            }
        </div>

    );
}

type VideoState = 'none' | 'analyzing' | 'done'

export default App;
