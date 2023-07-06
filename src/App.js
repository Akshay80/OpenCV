import { useEffect, useRef, useState } from "react";
import "./App.css";
import Webcam from "react-webcam";
import cv from "@techstark/opencv-js";
import { loadHaarFaceModels, detectHaarFace } from "./haarFaceDetection";

function App() {
  // const [imageSrc, setImageSrc] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const webcamRef = useRef(null);
  const imgRef = useRef(null);
  const faceImgRef = useRef(null);

  useEffect(() => {
    loadHaarFaceModels().then(() => {
      setModelLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!modelLoaded) return;

    const detectFace = async () => {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      return new Promise((resolve) => {
        imgRef.current.src = imageSrc;
        imgRef.current.onload = () => {
          try {
            const img = cv.imread(imgRef.current);
            detectHaarFace(img);
            cv.imshow(faceImgRef.current, img);

            img.delete();
            resolve();
          } catch (error) {
            // console.log(error);
            resolve();
          }
        };
      });
    };

    let handle;
    const nextTick = () => {
      handle = requestAnimationFrame(async () => {
        await detectFace();
        nextTick();
      });
    };
    nextTick();
    return () => {
      cancelAnimationFrame(handle);
    };
  }, [modelLoaded]);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    // setImageSrc(imageSrc);
  };

  const retake = () => {
    // setImageSrc(null);
  };
  return (
    <>
      <div>
        {/* <div style={{ display: "flex", flexDirection: "column" }}> */}
        {/* {imageSrc!== null ? <img src={imageSrc} alt="Captured" ref={imgRef}/> : <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" mirrored />} */}
        <h2>Real-time Face Detection for Cornea Care</h2>
        <Webcam
          ref={webcamRef}
          className="webcam"
          mirrored
          screenshotFormat="image/jpeg"
        />

        <img className="inputImage" alt="input" ref={imgRef} />
        <canvas className="outputImage" ref={faceImgRef} />
        {!modelLoaded && <div>Loading Haar-cascade face model...</div>}

        <div className="d-flex me-3 text-center">
          <button onClick={capture}>Capture</button>
          <button onClick={retake}>Retake</button>
        </div>

        {/* </div> */}
      </div>
    </>
  );
}

export default App;
