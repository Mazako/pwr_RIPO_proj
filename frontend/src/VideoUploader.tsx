import {ChangeEvent, FC, SyntheticEvent, useEffect, useRef, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {MaskRectangle, Position} from "./MaskRectangle";

type VideoState = 'PAUSE' | 'PLAYING'

const convertDurationToString = (duration: number): string => {
    let minutes = '';
    let seconds = '';

    if (duration < 60) {
        minutes = '00';
    } else {
        minutes = Math.floor(duration / 60).toString();
    }

    const modulo = (duration % 60);
    if (modulo < 10) {
        seconds = '0' + modulo;
    } else {
        seconds = modulo.toString();
    }
    return `${minutes}:${seconds}`;
};

const clamp = (value: number, max: number): number => {
    return Math.min(max, Math.max(value, 0));
};

interface VideoUploaderProps {
    file: File,
    showMask: boolean
    maskPosition: Position,
    setMaskPosition: (value: React.SetStateAction<Position>) => void
}

export const VideoUploader: FC<VideoUploaderProps> = ({file, maskPosition, setMaskPosition, showMask}) => {

    const videoPlayerRef = useRef<HTMLVideoElement>(null);
    const videoURL = URL.createObjectURL(file);
    const [videoLength, setVideoLength] = useState<number>(0);
    const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);
    const [videoState, setVideoState] = useState<VideoState>('PAUSE');

    const handleOnDrag = (dx: number, dy: number) => {
        setMaskPosition(prev => {
            return {
                ...prev,
                x: clamp(prev.x + dx, (videoPlayerRef.current?.videoWidth || 0) - prev.width),
                y: clamp(prev.y + dy, (videoPlayerRef.current?.videoHeight || 0) - prev.height)
            };
        });
    };

    const handleResize = (dx: number, dy: number) => {
        setMaskPosition(prev => {
            return {
                ...prev,
                width: clamp(prev.width + dx, (videoPlayerRef.current?.videoWidth || 0) - prev.x),
                height: clamp(prev.height + dy, (videoPlayerRef.current?.videoHeight || 0) - prev.y),
            };
        });
    };

    useEffect(() => {
        if (videoState === 'PAUSE') {
            videoPlayerRef.current?.pause();
        } else {
            videoPlayerRef.current?.play().then();
        }
    }, [videoState]);

    const handleMetadataLoad = (e: SyntheticEvent<HTMLVideoElement, Event>) => {
        setVideoLength(Number.parseInt(e.currentTarget.duration.toString()));
    };

    const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
        const changedValue = Number.parseInt(e.target.value);
        setCurrentTimestamp(changedValue);
        if (videoPlayerRef.current) {
            videoPlayerRef.current.currentTime = changedValue;
        }
    };

    const handleVideoProgress = (e: SyntheticEvent<HTMLVideoElement, Event>) => {
        setCurrentTimestamp(Number.parseInt(e.currentTarget.currentTime.toString()));
    };

    const renderTimeLabel = () => {
        return `${convertDurationToString(currentTimestamp)} / ${convertDurationToString(videoLength)}`;
    };

    return (
        <div>
            <div style={{position: "relative", zIndex: 3}} draggable={false}>
                <video draggable={false}
                       onLoadedMetadata={handleMetadataLoad}
                       ref={videoPlayerRef}
                       onTimeUpdate={handleVideoProgress}
                       muted
                       key={file.name}>
                    <source src={videoURL} type="video/mp4"/>
                </video>
                {
                    showMask
                    &&
                    <MaskRectangle position={maskPosition} onPositionChange={handleOnDrag} onResize={handleResize}/>
                }
            </div>
            <div className="d-flex align-items-center gap-3">
                <Button onClick={() => videoState === 'PAUSE' ? setVideoState('PLAYING') : setVideoState('PAUSE')}
                        style={{width: 50}}>
                    {videoState === 'PAUSE' ? '|>' : '||'}
                </Button>
                <Form.Range min={0} max={videoLength} step={1} onChange={handleSliderChange} value={currentTimestamp}/>
                <div className="text-nowrap">{renderTimeLabel()}</div>
            </div>
        </div>
    );
};
