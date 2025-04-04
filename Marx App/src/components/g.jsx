import React, { useState, useEffect } from 'react';
import "regenerator-runtime/runtime";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { MdMic, MdMicNone } from 'react-icons/md';

const MicrophoneCard = ({ updateMessage, selected }) => {
    const [isMicActive, setIsMicActive] = useState(false);
    const [currentTranscript, setCurrentTranscript] = useState("");
    const [messageStatus, setMessageStatus] = useState(""); // New state to track message status

    const { transcript, resetTranscript } = useSpeechRecognition();

    // Update currentTranscript whenever transcript changes
    useEffect(() => {
        setCurrentTranscript(transcript);
    }, [transcript]);

    const startMicrophone = () => {
        resetTranscript();  // Clear any previous transcript
        setCurrentTranscript(""); // Ensure the state is reset
        SpeechRecognition.startListening({ continuous: true });
        setIsMicActive(true);
        setMessageStatus("Listening..."); // Update message status while listening
    };

    const stopMicrophone = () => {
        SpeechRecognition.stopListening();
        setIsMicActive(false);

        // Send final transcript to ChatView if it's not empty
        if (currentTranscript.trim()) {
            updateMessage(currentTranscript.trim(), false, selected);
            setMessageStatus("Message Sent!"); // Provide feedback after sending the message
        } else {
            setMessageStatus("No Speech Detected"); // Feedback if no speech was detected
        }

        // Reset states
        resetTranscript();
        setCurrentTranscript(""); 
    };

    return (
        <div className="microphone-card border border-slate-300 rounded-lg p-4 shadow-md hover:scale-105 duration-500 ease-in-out w-80 h-50"
            style={{ position: 'relative', left: '-1.5rem' }}>
            <h2 className="text-lg font-semibold mb-2">Mic</h2>

            {/* Mic status container */}
            <div className="status-container mb-4 flex items-center justify-center h-[110px] bg-slate-200 rounded-lg"
                style={{
                    position: 'relative',
                    backgroundColor: 'transparent',
                    backdropFilter: 'blur(50px)',
                }}>
                {isMicActive ? (
                    <>
                        <MdMic size={48} className="text-green-500" />
                        <div className="ripple-container absolute inset-0 flex items-center justify-center">
                            <div className="ripple"></div>
                        </div>
                    </>
                ) : (
                    <MdMicNone size={48} className="text-gray-500" />
                )}
            </div>

            {/* Displaying current transcript */}
            {isMicActive && (
                <div className="transcript-display p-2 text-center bg-slate-100 rounded-md">
                    <p className="text-sm font-medium text-slate-600">{currentTranscript}</p>
                </div>
            )}

            {/* Controls */}
            <div className="controls flex gap-2 justify-center items-center mt-4">
                <button
                    className={`btn ${isMicActive ? 'btn-disabled' : ''}`}
                    onClick={startMicrophone}
                    disabled={isMicActive}
                >
                    Start Mic
                </button>
                <button
                    className={`btn ${!isMicActive ? 'btn-disabled' : ''}`}
                    onClick={stopMicrophone}
                    disabled={!isMicActive}
                >
                    Pause Mic
                </button>
            </div>

            {/* Message Status */}
            {messageStatus && (
                <div className="message-status mt-4 text-center text-sm font-semibold text-blue-500">
                    <p>{messageStatus}</p>
                </div>
            )}

            {/* Inline Keyframes */}
            <style>
                {`
                  .ripple-container {
                    position: absolute;
                    width: 100%;
                    height: 75%;
                  }
                  .ripple {
                    position: absolute;
                    margin-top: 30px;
                    width: 30px;
                    height: 30px;
                    border: 2px solid grey;
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
