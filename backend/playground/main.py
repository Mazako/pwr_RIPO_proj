import cv2

from video_analyzer import model_predictor

cv2.VideoCapture()

result_path = '../../images/outputs/cars.mp4'

model_predictor.predict_video('../../images/cars.mp4', result_path)

cap = cv2.VideoCapture(result_path)

fps = int(cap.get(cv2.CAP_PROP_FPS))

while True:
    success, img = cap.read()
    if success:
        cv2.imshow("image", img)
    else:
        break
    cv2.waitKey(int(1000 / fps))
