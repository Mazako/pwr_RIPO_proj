import json

from ripo.video_analyzer.detections import yolo_classes, DetectionClass, deer_dataset_classes


def _load_detection_classes(js: dict, yolo: dict[int, DetectionClass], deer: dict[int, DetectionClass]):
    yolo_detections = js['detections']['yolo']
    deer_detections = js['detections']['deer']

    for k, v in yolo_detections.items():
        yolo[int(k)].used = bool(v)

    for k, v in deer_detections.items():
        deer[int(k)].used = bool(v)


def _serialize_detection_classes(yolo: dict[int, DetectionClass], deer: dict[int, DetectionClass]) -> dict:
    data = {
        'yolo': {},
        'deer': {}
    }

    for k, v in yolo.items():
        data['yolo'][k] = v.used

    for k, v in deer.items():
        data['deer'][k] = v.used

    return data


def load_config():
    with open('../../init.json', 'r') as file:
        config_json = json.load(file)
        _load_detection_classes(config_json, yolo_classes, deer_dataset_classes)


def write_config():
    with open('../../init.json', 'w') as file:
        config = {
            'detections': _serialize_detection_classes(yolo_classes, deer_dataset_classes)
        }
        file.write(json.dumps(config, indent=2))

