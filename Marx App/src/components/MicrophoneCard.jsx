import React, { useState, useEffect } from 'react';
import "regenerator-runtime/runtime";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { MdMic,MdOutlinePlayArrow,MdPause } from 'react-icons/md';

const MicrophoneCard = ({ updateMessage, selected }) => {
    const [isMicActive, setIsMicActive] = useState(false);
    const [messageStatus, setMessageStatus] = useState("SPEAK");
    const { transcript, resetTranscript } = useSpeechRecognition();
    const [lastSpokenTime, setLastSpokenTime] = useState(null);
    const autoPauseDuration = 4000; // Auto-pause after 4 seconds of silence

    useEffect(() => {
        if (isMicActive && transcript) {
            setLastSpokenTime(Date.now()); // Update last spoken time on new input
        }
    }, [transcript]);

    useEffect(() => {
        let silenceTimeout;
        if (isMicActive) {
            silenceTimeout = setInterval(() => {
                if (lastSpokenTime && Date.now() - lastSpokenTime > autoPauseDuration) {
                    stopMicrophone();
                }
            }, 1000);
        }
        return () => clearInterval(silenceTimeout);
    }, [isMicActive, lastSpokenTime]);

    const startMicrophone = () => {
        resetTranscript();  
        SpeechRecognition.startListening({ continuous: true });
        setIsMicActive(true);
        setMessageStatus("Listening...");
        setLastSpokenTime(Date.now());
    };

    const stopMicrophone = () => {
        SpeechRecognition.stopListening();
        setIsMicActive(false);
        resetTranscript();
        setMessageStatus("Mic Paused");
    };

    return (
        <div className="microphone-card input-bordered w-fit z-10 rounded-lg p-3 w-full h-30"
            style={{ position: 'relative' }}>
            <div className="status-container flex items-center justify-center h-[40px] bg-slate-200 rounded-lg"
                style={{ position: 'relative', backgroundColor: 'transparent' }}>
                {isMicActive ? (
                    <>
                    <div className="ripple-container absolute flex items-center justify-center">
                            <div className="ripple"></div>
                        </div>
                        <MdMic size={48} className="text-grey-500" />
                        
                    </>
                ) : (
                    <MdMic size={48} className="text-gray-500" />
                )}
            </div>

            {messageStatus && (
                <div className="message-status mt-70 text-center text-sm font-semibold">
                    <p>{messageStatus}</p>
                </div>
            )}

            {isMicActive && (
                <div className="transcript-display p-2 text-center bg-slate-10 rounded-md">
                    <p className="text-sm font-medium border text-black-500">{transcript}</p>
                </div>
            )}

            <div className="controls flex gap-2 justify-center items-center mt-4" style={{ marginLeft: '20px' }}>
                <button className={`btn border border-slate-500 hover:border-slate-800 ${isMicActive ? 'btn-disabled' : ''}`} onClick={startMicrophone} disabled={isMicActive}>
                <MdOutlinePlayArrow size={30} />Start Mic
                </button>
                <button className={`btn border border-slate-500 hover:border-slate-800 ${!isMicActive ? 'btn-disabled' : ''}`} onClick={stopMicrophone} disabled={!isMicActive}>
                <MdPause size={30} />Pause Mic
                </button>
            </div>

            <style>
                {`
                  .ripple-container {
                    position: absolute;
                    width: 100%;
                    height: 75%;
                  }
                  .ripple {
                    position: absolute;
                    width: 30px;
                    height: 30px;
                    border: 2px solid red;
                    border-radius: 60%;
                    animation: rippleEffect 2s infinite;
                    opacity: 0.7;
                  }
                  .ripple:nth-child(2) {
                    animation-delay: 1s;
                  }
                  @keyframes rippleEffect {
                    0% {
                      transform: scale(0);
                      opacity: 1;
                    }
                    75% {
                      transform: scale(0.2);
                      opacity: 0.8;
                    }
                    50% {
                      transform: scale(2);
                      opacity: 0.5;
                    }
                    100% {
                      transform: scale(2.5);
                      opacity: 0.1;
                    }
                  }
                `}
            </style>
        </div>
    );
};

export default MicrophoneCard;
