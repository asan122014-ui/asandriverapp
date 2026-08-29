import { useEffect, useRef, useState } from "react";

function CameraCapture({ onCapture, onCancel }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  // Preview state
  const [previewBlob, setPreviewBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Camera is not supported on this device.");
      onCancel();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: "environment",
          },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        try {
          await videoRef.current.play();
        } catch (err) {
          console.error(err);
          alert("Failed to start camera.");
          stopCamera();
          onCancel();
        }
      }
    } catch (err) {
      console.error(err);
      stopCamera();
      alert("Unable to access camera.");
      onCancel();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    setCameraReady(false);
  };

  const capturePhoto = () => {
    if (isCapturing) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      alert("Camera is not ready.");
      return;
    }

    if (!cameraReady || video.readyState < 2) {
      alert("Camera is still loading.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          alert("Failed to capture photo.");
          return;
        }

        stopCamera();

        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }

        setPreviewBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
      },
      "image/jpeg",
      0.95
    );
  };

  const confirmPhoto = async () => {
    if (!previewBlob) return;

    setIsCapturing(true);

    try {
      await onCapture(previewBlob);

      URL.revokeObjectURL(previewUrl);
      setPreviewBlob(null);
      setPreviewUrl("");
    } catch (err) {
      console.error(err);
      alert("Failed to upload photo.");

      URL.revokeObjectURL(previewUrl);
      setPreviewBlob(null);
      setPreviewUrl("");

      await startCamera();
    } finally {
      setIsCapturing(false);
    }
  };

  const retakePhoto = async () => {
    URL.revokeObjectURL(previewUrl);

    setPreviewBlob(null);
    setPreviewUrl("");

    await startCamera();
  };

  // ================= PREVIEW SCREEN =================

  if (previewUrl) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        <img
          src={previewUrl}
          alt="Preview"
          className="flex-1 w-full object-contain bg-black"
        />

        <div className="bg-white p-5 flex gap-3">
          <button
            onClick={retakePhoto}
            disabled={isCapturing}
            className="flex-1 py-3 rounded-lg bg-gray-200 font-medium disabled:opacity-50"
          >
            Retake
          </button>

          <button
            onClick={confirmPhoto}
            disabled={isCapturing}
            className="flex-1 py-3 rounded-lg bg-yellow-400 font-bold disabled:opacity-50"
          >
            {isCapturing ? "Uploading..." : "OK"}
          </button>
        </div>
      </div>
    );
  }

  // ================= CAMERA SCREEN =================

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        onLoadedMetadata={() => {
          setCameraReady(true);
          videoRef.current?.play().catch(console.error);
        }}
        className="flex-1 w-full object-cover"
      />

      <canvas ref={canvasRef} className="hidden" />

      <div className="bg-white p-5 flex gap-3">
        <button
          onClick={() => {
            stopCamera();
            onCancel();
          }}
          disabled={isCapturing}
          className="flex-1 py-3 rounded-lg bg-gray-200 font-medium disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          onClick={capturePhoto}
          disabled={!cameraReady || isCapturing}
          className="flex-1 py-3 rounded-lg bg-yellow-400 font-bold disabled:opacity-50"
        >
          Capture
        </button>
      </div>
    </div>
  );
}

export default CameraCapture;