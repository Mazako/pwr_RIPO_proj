import math

import cv2
import cvzone

from .detections import yolo_classes, DetectionClass, deer_dataset_classes
from .models import yolo_8l, yolo_deer_1
from ..app.model import MaskPosition


def _analyze_frame(results, img, classes: dict[int, DetectionClass]):
    for result in results:
        boxes = result.boxes
        for box in boxes:
            cls_id = int(box.cls[0])
            if classes.get(cls_id) is not None and classes.get(cls_id).used:
                class_name = classes[cls_id].name
                x1, y1, x2, y2 = box.xyxy[0]
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)

                w, h = x2 - x1, y2 - y1
                cvzone.cornerRect(img, (x1, y1, w, h))

                conf = math.ceil((box.conf[0] * 100)) / 100
                print(conf)

                cvzone.putTextRect(img, f'{class_name} {conf}', (max(0, x1), max(35, y1)), scale=1, thickness=1)


def predict_video(path: str, result_path: str, on_progress=None, mask: MaskPosition = None):
    cap = cv2.VideoCapture(path)
    video_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    video_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    output = cv2.VideoWriter(result_path,
                             cv2.VideoWriter_fourcc(*'avc1'),
                             fps, (video_w, video_h))

    for i in range(length):
        print(f'processing frame {i}/{length}')
        if on_progress is not None:
            on_progress(i, length)
        _, img = cap.read()

        if mask is not None:
            clipped = img.copy()
            clipped[mask.y: mask.y + mask.height, mask.x: mask.x + mask.width, :] = [0, 0, 0]
        else:
            clipped = img

        results = yolo_8l.predict(clipped, stream=True, verbose=False)
        _analyze_frame(results, img, yolo_classes)
        if deer_dataset_classes.get(0).used:
            results = yolo_deer_1.predict(clipped, stream=True, verbose=False)
            _analyze_frame(results, img, deer_dataset_classes)
        output.write(img)
    output.release()
