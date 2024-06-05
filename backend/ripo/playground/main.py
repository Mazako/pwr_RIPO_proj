import cv2
import matplotlib.pyplot as plt
import numpy as np

# Ładowanie i przygotowanie obrazów
warnImage = cv2.imread('../../warn.png')
warnImage = cv2.cvtColor(warnImage, cv2.COLOR_BGR2RGB)
warnImage = cv2.resize(warnImage, (100, 100))  # Rozmiar ikony

img = cv2.imread('../../images/outputs/img_1.png')
img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

mask = np.all(warnImage > [0, 0, 0], axis=2)
mask = np.repeat(mask[:, :, np.newaxis], 3, axis=2)

img[:100, :100][mask] = warnImage[mask]

# Wyświetlenie wyniku
plt.imshow(img)
plt.show()  # Zastępuje waitforbuttonpress dla bardziej standardowego podejścia
