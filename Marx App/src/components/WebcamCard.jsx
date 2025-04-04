import React, { useRef, useState, useEffect } from 'react';
import { MdVideocam, MdCameraswitch} from 'react-icons/md'; // Import an icon for no webcam

const WebcamCard = () => {
  const videoRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);

  useEffect(() => {
    // Cleanup: Stop the stream when the component is unmounted
    return () => stopWebcam();
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setStreamActive(true);
    } catch (err) {
      console.error('Error accessing webcam:', err);
      alert('Unable to access webcam. Please check permissions.');
    }
  };

  const stopWebcam = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setStreamActive(false);
    }
  };

  return (
    <div className="webcam-card border border-slate-300 rounded-lg p-4 shadow-md hover:scale-105 duration-500 ease-in-out w-80"
    style={{
        position: 'relative',
        left: '-1.5rem',
        backdropFilter: 'blur(10px)', // Optional for frosted glass effect
      }}>
      <h2 className="text-lg font-semibold mb-2">Cam</h2>
      <div className="video-container mb-3 bg-slate-200  relative w-full h-48 bg-slate-200 rounded-lg overflow-hidden"
      style={{
        position: 'relative',
        backgroundColor: 'transparent', // Transparent background
        backdropFilter: 'blur(50px)', // Optional for frosted glass effect
      }}>
        {!streamActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <MdVideocam size={50} />
          </div>
        )}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transform scale-x-[-1] ${
            !streamActive ? 'opacity-0' : ''
          }`}
        />
      </div>
      <div className="controls flex gap-2 justify-center">
        <button
          className={`btn ${streamActive ? 'btn-disabled' : ''}`}
          onClick={startWebcam}
          disabled={streamActive}
        >
          Start Cam
        </button>
        <button
          className={`btn ${!streamActive ? 'btn-disabled' : ''}`}
          onClick={stopWebcam}
          disabled={!streamActive}
        >
          Pause Cam
        </button>
      </div>
    </div>
  );
};

export default WebcamCard;