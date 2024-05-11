import React, {FC, MouseEvent, useEffect, useState} from "react";
import styles from './MaskRectangle.module.css';

export interface Position {
    x: number,
    y: number,
    width: number,
    height: number,
}

export interface MaskRectangleProps {
    position: Position;
    onPositionChange: (dx: number, dy: number) => void;
    onResize: (dx: number, dy: number) => void;
}

export const MaskRectangle: FC<MaskRectangleProps> = ({position, onPositionChange, onResize}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isResize, setIsResize] = useState(false);
    const [initialMousePosition, setInitialMousePosition] = useState({x: 0, y: 0});

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const deltaX = event.clientX - initialMousePosition.x;
            const deltaY = event.clientY - initialMousePosition.y;
            setInitialMousePosition({x: event.clientX, y: event.clientY});

            if (isDragging) {
                onPositionChange(deltaX, deltaY);
            } else if (isResize) {
                onResize(deltaX, deltaY);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResize(false);
        };

        if (isDragging || isResize) {
            // @ts-ignore
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            // @ts-ignore
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            // @ts-ignore
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, initialMousePosition, onPositionChange]);

    const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setInitialMousePosition({x: event.clientX, y: event.clientY});
    };

    const handleOuterMouseDown = (event: MouseEvent<HTMLDivElement>) => {
        setIsResize(true);
        setInitialMousePosition({x: event.clientX, y: event.clientY});
    };


    return (
        <div className={styles.outer}
             style={{top: position.y, left: position.x, width: position.width + 7, height: position.height + 7}}
             onMouseDown={handleOuterMouseDown}>

            <div className={styles.rect}
                 style={{top: 0, left: 0, width: position.width, height: position.height}}
                 onMouseDown={handleMouseDown}>
            </div>
        </div>

    );
};
