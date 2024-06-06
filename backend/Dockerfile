FROM ubuntu:22.04

RUN apt update
RUN apt install -y python3.10 build-essential cmake git pkg-config libgtk-3-dev \
  libavcodec-dev libavformat-dev libswscale-dev libv4l-dev \
  libxvidcore-dev libx264-dev libjpeg-dev libpng-dev libtiff-dev \
  gfortran openexr libatlas-base-dev python3-dev python3-numpy \
  libtbb2 libtbb-dev libdc1394-dev python3-pip

RUN mkdir /opencv_build
WORKDIR /opencv_build
RUN git clone https://github.com/opencv/opencv.git
RUN git clone https://github.com/opencv/opencv_contrib.git
WORKDIR /opencv_build/opencv
RUN mkdir build
WORKDIR /opencv_build/opencv/build

RUN cmake -D CMAKE_BUILD_TYPE=RELEASE \
          -D CMAKE_INSTALL_PREFIX=/usr/local \
          -D INSTALL_C_EXAMPLES=ON \
          -D INSTALL_PYTHON_EXAMPLES=ON \
          -D OPENCV_GENERATE_PKGCONFIG=ON \
          -D OPENCV_EXTRA_MODULES_PATH=/opencv_build/opencv_contrib/modules \
          -D BUILD_EXAMPLES=ON \
          -D WITH_FFMPEG=ON ..

RUN make -j$(nproc)
RUN make install

COPY ./images /app/images
COPY ./model /app/model
COPY ./ripo /app/ripo
COPY ./ideal_init.json /app/init.json
COPY ./requirements.txt /app
COPY ./warn.png /app

WORKDIR /app

RUN pip install -r requirements.txt
RUN pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

EXPOSE 8000

CMD ["uvicorn", "ripo.app.app:app", "--host", "0.0.0.0", "--port", "8000"]

