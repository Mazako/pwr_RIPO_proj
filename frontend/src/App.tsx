import React, {ChangeEvent, useState} from 'react';
import {ProgressBar} from "react-bootstrap";

function App() {

    const [videoState, setVideoState] = useState<VideoState>('none');
    const [video, setVideo] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
    const [videoId, setVideoId] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);

    const checkVideoAvailable = async (id: string) => {
        console.log(`http://localhost:8000/ready?video_id=${id}`)
        const response = await fetch(`http://localhost:8000/ready?video_id=${id}`);
        const json = await response.json();
        setProgress(Number(json['progress']));
        return Boolean(json['ready'])
    }


    const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setVideo(e.target.files[0])
        }
    }

    const handleVideoSend = async () => {
        const data = new FormData();
        // @ts-ignore
        data.set('video', video)

        const response = await fetch('http://localhost:8000/analyze', {
            method: 'POST',
            body: data
        });
        setVideoState('analyzing');
        const json = await response.json();
        const id = json['id']
        setVideoId(id)
        const inrervalId = setInterval(async () => {
            const available = await checkVideoAvailable(id);
            console.log(available)
            if (available) {
                setVideoUrl(`http://localhost:8000/getVideo?video_id=${id}`);
                setVideoState('done');
                clearInterval(inrervalId);
            }
        }, 1000)
    }


    return (
        <div className='d-flex flex-column align-items-center'>
            <h1 className='display-1'>Analizuj se filmosa d-_-b</h1>
            <input type='file'
                   title='Wybierz plik'
                   onChange={handleVideoChange}
            />
            <button disabled={!video} onClick={handleVideoSend}>Analizuj</button>
            {
                videoState === 'analyzing'
                &&
                <div className='w-100'>
                    <ProgressBar now={progress}/>
                </div>
            }
            {
                videoState === 'done'
                &&
                <video autoPlay controls>
                    <source src={videoUrl} type='video/mp4'/>
                </video>
            }
        </div>

    );
}

type VideoState = 'none' | 'analyzing' | 'done'

export default App;
