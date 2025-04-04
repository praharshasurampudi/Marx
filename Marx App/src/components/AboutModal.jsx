import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const AboutModal = ({ modalOpen, setModalOpen }) => {
  const [aboutText, setAboutText] = useState('');
  const [showTeam, setShowTeam] = useState(false); // State to toggle team visibility

  useEffect(() => {
    if (modalOpen) {
      setAboutText(
        `MARX is a Conversational Artificial Intelligence designed to engage with users in a dynamic and immersive way. 
        More than just an AI, Whether you seek a mentor, a friend, or simply a voice that understands you, 
        MARX adapts to your needs, making every interaction feel real, dynamic, and uniquely personal.`
        
      );
    }
  }, [modalOpen]);

  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      <p className="text-justify leading-relaxed tracking-wide">{aboutText}</p>
      <ul className='text-justify tracking-wide mt-3 list-disc pl-5 space-y-1'>
        <li>A Speech to Speech Conversational AI Assistant</li>
        <li>Two Powerful Models: MX Basic & MX Advance</li>
        <li>Customized Adaptive Themes and Soulful Moods</li>
        <li>An Interactive UI and Personalized Experience</li>

      </ul>

      {/* Button to toggle team members */}
      <button
        style={{ cursor: 'cell' }}
        className='w-full max-w-xs btn btn-outline mt-4'
        onClick={() => setShowTeam(!showTeam)}
      >
        {showTeam ? 'Hide the Info' : 'Creator of MARX.ai'}
      </button>

      {/* Display team members if showTeam is true */}
      {showTeam && (
        <div className='mt-3 text-center'>
          <p className='font-semibold'>Meet the Creator:</p>
          <ul className="space-y-1 mt-1">
            <li className="flex items-center">
              <span className="mr-2">➤</span> Praharsha Surampudi
            </li>

          </ul>
        </div>
      )}
    </div>
  );
};

export default AboutModal;

AboutModal.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  setModalOpen: PropTypes.func.isRequired,
};
