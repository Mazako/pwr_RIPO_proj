from pydantic import BaseModel


class DetectionClass(BaseModel):
    name: str
    used: bool


class DetectionClassDto(DetectionClass):
    type_of_model: str
    id: int


yolo_classes = {
    0: DetectionClass(name='person', used=True),
    1: DetectionClass(name='bicycle', used=True),
    2: DetectionClass(name='car', used=True),
    3: DetectionClass(name='motorcycle', used=True),
    5: DetectionClass(name='bus', used=True),
    7: DetectionClass(name='truck', used=True),
}

deer_dataset_classes = {
    0: DetectionClass(name='deer', used=True)
}
