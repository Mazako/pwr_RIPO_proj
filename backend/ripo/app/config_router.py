from fastapi import APIRouter

from ripo.video_analyzer.detections import yolo_classes, DetectionClassDto, deer_dataset_classes

config_router = APIRouter(prefix='/config')


@config_router.get('/classes')
def get_classes():
    return [DetectionClassDto(**v.model_dump(), id=k, type_of_model='yolo') for k, v in yolo_classes.items()] \
        + [DetectionClassDto(**v.model_dump(), id=k, type_of_model='deer') for k, v in deer_dataset_classes.items()]


@config_router.patch('/classes/update')
def update_class(class_id: int, class_type: str, value: bool):
    if class_type == 'yolo':
        yolo_classes[class_id].used = value
    else:
        deer_dataset_classes[class_id].used = value

