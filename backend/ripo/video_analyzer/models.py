from ultralytics import YOLO

yolo_8l = YOLO('./model/yolov8l.pt', verbose=False)
yolo_deer_1 = YOLO('./model/deer_three.pt', verbose=False)

