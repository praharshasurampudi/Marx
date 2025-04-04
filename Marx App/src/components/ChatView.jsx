import { useState, useRef, useEffect, useContext } from 'react';
import WebcamCard from './WebcamCard';
import MicrophoneCard from './MicrophoneCard';
import Message from './Message';
import { ChatContext } from '../context/chatContext';
import Thinking from './Thinking';
import { replaceProfanities } from 'no-profanity';
import { davinci } from '../utils/davinci';
import Modal from './Modal';
import Setting from './Setting';
import useDarkMode from '../hooks/useDarkMode';
import marxLogoLight from '../assets/marx-logo-light.png';
import marxLogoDark from '../assets/marx-logo-dark.png';
import art from '../assets/art.png';
import videoAnimePrince from '../assets/MARX Animeprince.mp4';
import videoSpaceSinger from '../assets/MARX Spacesinger.mp4';
import videoSanctumMonk from '../assets/MARX Sanctummonk.mp4';
import { MdOutlineNightlight, MdOutlineWbSunny, MdSpeakerNotesOff, MdSend } from 'react-icons/md';
import { motion } from "framer-motion";
import "regenerator-runtime/runtime";
import { useSpeechRecognition } from 'react-speech-recognition';
import { useSpeechSynthesis } from 'react-speech-kit';


// const options = ['ChatGPT', 'DALL·E'];
const gptModel = ['gpt-3.5-turbo', 'gpt-4'];
const template = [
  {
    title: 'Hello MARX', 
    prompt: "Introduce Yourself and how can you help me.",
  },
  {
    title: 'What makes you special?', 
    prompt: "What makes you different from other AI? ",
  },
  {
    title: "What’s your favorite thing to do?", 
    prompt: "Out of all the things, what do you enjoy the most?",
  },
  {
    title: 'Can you tell me a fun fact?', 
    prompt: "I’m bored. Tell me something fun I might not know!",
  },
];

/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
  const { speak } = useSpeechSynthesis(); // hook for text-to-speech
  const messagesEndRef = useRef();
  const inputRef = useRef();
  const [formValue, setFormValue] = useState('');
  const [thinking, setThinking] = useState(false);
  const [selected, setSelected] = useState(gptModel[0]);
  const [gpt, setGpt] = useState(gptModel[0]);
  const [messages, addMessage] = useContext(ChatContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [theme, setTheme, imageSrc] = useDarkMode();
  const logo = theme === 'dark' ? marxLogoDark : marxLogoLight;
  /**
   * Scrolls the chat area to the bottom.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  // Initialize Speech Recognition
  const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Function to handle when the microphone button is clicked
  const handleMicClick = () => {
    if (listening) {
      resetTranscript();
    }
    if (!listening) {
      startListening();
    }
  };

  // Function to start listening to speech
  const startListening = () => {
    // Start listening to the user's speech
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
  };

  // Function to stop listening to speech
  const stopListening = () => {
    // Stop listening to the user's speech
    SpeechRecognition.stopListening();
  };

  /**
   * Adds a new message to the chat.
   *
   * @param {string} newValue - The text of the new message.
   * @param {boolean} [ai=false] - Whether the message was sent by an AI or the user.
   */
  const updateMessage = (newValue, ai = false, selected) => {
    try {
      // Prevent empty messages
      if (!newValue || newValue.trim() === "") {
        console.warn("Warning: Empty input message, ignoring.");
        return; // Exit function early
      }
  
      const id = Date.now() + Math.floor(Math.random() * 1000000);
      const newMsg = {
        id: id,
        createdAt: Date.now(),
        text: newValue,
        ai: ai,
        selected: `${selected}`,
      };
  
      addMessage(newMsg);
  
      if (ai) {
        window.speechSynthesis.cancel(); // Stop ongoing speech
  
        const voices = window.speechSynthesis.getVoices();
        
        if (!voices.length) {
          console.warn("No voices available for speech synthesis.");
          return; // Exit if no voices are found
        }
  
        const preferredVoice = voices.find(voice => voice.name.includes("Google UK English Male")) || voices[1] || voices[0];
  
        const utterance = new SpeechSynthesisUtterance(newValue);
        utterance.voice = preferredVoice;
        utterance.rate = 1.10 + Math.random() * 0.1;
        utterance.pitch = 1.0 + Math.random() * 0.2;
        utterance.volume = 1;
  
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      if (error.message.includes("Error: Error: input values have 1 keys, you must specify an input key or pass only 1 key as input please try again later")) {
        console.warn("Known input error ignored:", error.message);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  
  // Function to stop speaking
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };
  


  /**
   * Sends our prompt to our API and get response to our request from openai.
   *
   * @param {Event} e - The submit event of the form.
   */
  const sendMessage = async (e) => {
    e.preventDefault();

    const key = window.localStorage.getItem('api-key');
    if (!key) {
      setModalOpen(true);
      return;
    }

    const cleanPrompt = replaceProfanities(formValue);

    const newMsg = cleanPrompt;
    const aiModel = selected;
    const gptVersion = gpt;

    setThinking(true);
    setFormValue('');
    updateMessage(newMsg, false, aiModel);
    console.log(gptVersion);

    console.log(selected);
    try {
      if (aiModel === gptModel[0]) {
        const LLMresponse = await davinci(cleanPrompt, key, gptVersion);
        //const data = response.data.choices[0].message.content;
        LLMresponse && updateMessage(LLMresponse, true, aiModel);
      }
    } catch (err) {
      window.alert(`Error: ${err} please try again later`);
    }

    setThinking(false);
    resetTranscript();

  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Prevent shift + enter from triggering submission
      e.preventDefault(); // Prevents adding a new line in the input field
      if (formValue.trim() !== '') { // Prevents empty messages
        await sendMessage(e);
      }
    }
  };
  
  
  

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  /**
   * Scrolls the chat area to the bottom when the messages array is updated.
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking]);

  /**
   * Focuses the TextArea input to when the component is first rendered.
   */
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    setFormValue(transcript); // Update the textarea with the speech input
  }, [transcript]);

  return (
    <main className={`relative flex flex-col h-screen overflow-hidden chat-view ${theme === 'dark' ? 'dark' : 'light'}`}>
      {/* Logo Section */}
      <div>
        <div className="absolute top-3 left-3 z-20 duration-500 ease-in-out transform hover:scale-105">
          <div className="w-64 h-16 overflow-hidden">
            <img
              src={logo}
              alt="MARX Logo"
              className="w-full h-full object-cover transition-all duration-500 ease-in-out"
            />
          </div>
        </div>
      </div>

      {/* Hanging Bulb Icon (Top Right Corner) */}
      <div
        className="absolute top-8 right-1 transform -translate-x-1/2 flex items-center space-x-2 z-20 cursor-pointer transition-all duration-500 ease-in-out hover:scale-110"
        onClick={toggleTheme}
      > <span className="text-m font-semibold select-none">THEME</span>
        {theme === 'dark' ? (
          <MdOutlineWbSunny size={30} color="white" />
        ) : (
          <MdOutlineNightlight size={30} color="black" />
        )}        

      </div>

      {/* Chat Tabs */}
      <div className="mx-auto my-6 border-slate-300 hover:border-slate-500 input-bordered gap-1 tabs tabs-boxed w-fit z-10"
        style={{ marginLeft: '17rem', marginTop: '25px', }}
      >
        <a
          onClick={() => {
            if (selected !== 'THE ANIME PRINCE') {
              setSelected('THE ANIME PRINCE');
              document.getElementById('animePrince').style.display = 'block';
              document.getElementById('spaceSinger').style.display = 'none';
              document.getElementById('sanctumMonk').style.display = 'none';
            }
          }}
          className={`tab ${selected === 'THE ANIME PRINCE' && 'tab-active'}`}
        >
          THE ANIME PRINCE
        </a>
        <a
          onClick={() => {
            if (selected !== 'THE SANCTUM MONK') {
              setSelected('THE SANCTUM MONK');
              document.getElementById('animePrince').style.display = 'none';
              document.getElementById('spaceSinger').style.display = 'none';
              document.getElementById('sanctumMonk').style.display = 'block';
            }
          }}
          className={`tab ${selected === 'THE SANCTUM MONK' && 'tab-active'}`}
        >
          THE SANCTUM MONK
        </a>
        <a
          onClick={() => {
            if (selected !== 'THE SPACE SINGER') {
              setSelected('THE SPACE SINGER');
              document.getElementById('animePrince').style.display = 'none';
              document.getElementById('spaceSinger').style.display = 'block';
              document.getElementById('sanctumMonk').style.display = 'none';
            }
          }}
          className={`tab ${selected === 'THE SPACE SINGER' && 'tab-active'}`}
        >
          THE SPACE SINGER
        </a>

      </div>

      {/* Hardcoded Video Sections */}
      <div className="absolute border border-slate-500 shadow-md rounded-lg transform -translate-x-1/2 -z-20"
        style={{
          position: 'absolute',
          top: '100px',
          width: '60%',
          height: '400px',
          marginLeft: '35%',

        }}>
        <video id="animePrince" className="w-full h-full object-cover rounded-lg" autoPlay loop muted>
          <source src={videoAnimePrince} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <video id="spaceSinger" className="w-full h-full object-cover rounded-lg" autoPlay loop muted style={{ display: 'none' }}>
          <source src={videoSpaceSinger} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <video id="sanctumMonk" className="w-full h-full object-cover rounded-lg" autoPlay loop muted style={{ display: 'none' }}>
          <source src={videoSanctumMonk} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Chat Messages Section */}
      <section className=""
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          width: '34%',
          marginLeft: '65.7%',
          overflowY: 'scroll',
          zIndex: 20,
          marginTop: '10px',
          marginBottom: '20px'
        }}
      >
        {/* Card container for chat messages */}
        <div className="border border-slate-500 rounded-lg shadow-md"
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '10px',
            gap: '10px',
            height: '80vh', // Ensures the chatbox fits within the viewport
            maxHeight: 'calc(100vh - 150px)', // Prevents overflow while keeping space for input
            overflowY: 'scroll',
          }}
        >
        <h2 className="text-lg font-semibold text-center mb-1">MARX CHAT</h2>
        <div>
          {messages.length ? (
            messages.map((message, index) => <Message key={index} message={{ ...message }} />)
          ) : (
            <div
              style={{
                width: '100%',
                display: 'flex',
                paddingBottom:'15px'
              }}
            >
              <div
                style={{
                  width: '100vw',
                  height: '32.5vw',
                  overflow: 'hidden',
                }}
              >
                <ul
                  style={{
                    position: 'absolute',
                    display: 'grid',
                    gridTemplateRows: 'repeat(1)',
                    gap: '0.75rem',
                    padding: '0.5rem',
                    marginRight:'50px',
                    height: '450px',
                    width:'100%'
                  }}
                  
                >
                  {template.map((item, index) => (
                    <li
                      onClick={() => setFormValue(item.prompt)}
                      key={index}
                      class = "border-l border-slate-800 rounded-lg duration-500 ease-in-out transform hover:scale-105"
                      style={{
                        cursor: 'pointer',
                        padding: '1.4rem',
                        borderRadius: '0.375rem',
                      }}
                    >
                      <p style={{ fontSize: '1.0rem', fontWeight: '600' }}>{item.title}</p>
                      <p style={{ fontSize: '0.9rem' }}>{item.prompt}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {thinking && <Thinking />}
          <span ref={messagesEndRef}></span> {/* Scroll target */}
        </div>
        </div>
      </section>

      <form>
        <div
          className="border border-slate-500 rounded-lg transform -translate-x-1/2 overflow-hidden"
          style={{
            position: 'absolute',
            top: '480px',
            width: '60%',
            marginTop: '2%',
            marginLeft: '35%',
            minHeight: '157px',
            maxHeight: '100vh',
            overflowY: 'auto'
          }}
        >
          {/* Blurred Video Background */}
          <div
            className="absolute inset-0 -z-10 rounded-lg overflow-hidden"
            style={{
              backgroundImage: `url(${art})`,
              backgroundSize: 'cover',
              backgroundPosition: 'top',
              backgroundRepeat: 'no-repeat',
            }}>
            <div className="bg-neutral bg-opacity-90 w-full h-full absolute top-0 left-0 z-0"></div> {/* Overlay */}</div>
          {/* Microphone Card Content */}
          <MicrophoneCard 
          updateMessage={updateMessage}
          onSubmit={sendMessage}
          />
        </div>
      </form>

      {/* Message Input */}
      <form className="flex flex-col gap-1 px-5 py-5 mb-2 md:px-22 join sm:flex-row z-10" style={{ marginLeft: '40px' }} onSubmit={sendMessage}>
        <select onChange={(e) => setGpt(e.target.value)} value={gpt} className="w-full border-slate-500 hover:border-slate-800 sm:w-40 select">
          <option value={gptModel[0]}>MX BASIC</option>
          <option value={gptModel[1]}>MX ADVANCE</option>
        </select>

        <div className="flex items-stretch gap-1 justify-between w-full join-item">
        <textarea
          ref={inputRef}
          placeholder="Interact with MARX here"
          className="w-full border-slate-500 hover:border-slate-800 grow input max-h-[20rem] min-h-[3rem] leading-[2.5rem]"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />


          <button type="submit" className="btn border-slate-500 hover:border-slate-800">
            <MdSend size={30} />
          </button>
          <button className="btn border-slate-500 hover:border-slate-800"
          onClick={stopSpeaking}>
            <MdSpeakerNotesOff size={30} />
          </button>

        </div>
      </form>

      {/* Modal */}
      <Modal title="Setting" modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <Setting modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </Modal>
    </main>
  );
};

export default ChatView;
