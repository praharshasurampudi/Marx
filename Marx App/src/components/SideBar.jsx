import { useState, useEffect, useContext } from 'react';
import {
  MdClose, MdMenu, MdOutlineAttachMoney, MdOutlineVpnKey, MdDelete, MdDashboard, MdLogout
} from 'react-icons/md';
import { ChatContext } from '../context/chatContext';
import { AuthContext } from '../context/AuthProvider';
import { Link } from 'react-router-dom';
import bot from '../assets/logo.svg';
import art from '../assets/art.png';
import Modal from './Modal';
import Setting from './Setting';
import AboutModal from './AboutModal';

const SideBar = () => {
  const [open, setOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [, , clearChat] = useContext(ChatContext);
  const { logOut } = useContext(AuthContext) || {};

  // Handle window resize
  const handleResize = () => {
    setOpen(window.innerWidth > 720);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle Logout
  const handleLogout = () => {
    if (logOut) {
      logOut()
        .then(() => console.log("User logged out successfully."))
        .catch((error) => console.error("Logout error:", error));
    } else {
      console.error("logOut function is undefined. Ensure AuthContext is correctly provided.");
    }
  };

  return (
    <section
      className={`${open ? 'w-72' : 'w-16'} flex flex-col items-center gap-y-4 h-screen pt-4 relative duration-100 shadow-md`}
      style={{
        backgroundImage: `url(${art})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
      
      <div className="bg-neutral bg-opacity-80 w-full h-full absolute top-0 left-0 z-0"></div> {/* Overlay */}
      
      <div className="flex items-center justify-between w-full px-2 mx-auto z-10">
        <div className={`${!open && 'scale-0 hidden'} flex flex-row items-center gap-2 mx-auto w-full`}>
          <img src={bot} alt="logo" className="w-6 h-6" />
          <h1 className={`${!open && 'scale-0 hidden'}`}>MARX.ai</h1>
        </div>
        <button className="mx-auto btn btn-square btn-ghost" onClick={() => setOpen(!open)}>
          {open ? <MdClose size={15} /> : <MdMenu size={15} />}
        </button>
      </div>

      <ul className="w-full menu rounded-box z-10">
        <li className="mb-1">
          <button
            className={`border border-slate-500 w-full flex ${open ? "items-center gap-2" : "justify-center"} p-2 rounded-md 
                      transition transform hover:-translate-y-1 hover:bg-opacity-50`}
            onClick={() => setAboutOpen(true)}
          >
            <MdDashboard size={20} />
            <p className={`${!open && "hidden"}`}>About MARX</p>
          </button>
        </li>
        <li>
          <button
            className={`border border-slate-500 w-full flex ${open ? "items-center gap-2" : "justify-center"} p-2 rounded-md 
                      transition transform hover:-translate-y-1 hover:bg-opacity-50`}
            onClick={clearChat}
          >
            <MdDelete size={20} />
            <p className={`${!open && "hidden"}`}>Clear Convos</p>
          </button>
        </li>
      </ul>

      <ul className="absolute bottom-5 w-full gap-1 menu rounded-box z-10">
        <li>
          <button
            className={`border border-slate-500 w-full flex ${open ? "items-center gap-2" : "justify-center"} p-2 rounded-md 
                      transition transform hover:-translate-y-1 hover:bg-opacity-50`}
            onClick={() => setModalOpen(true)}
          >
            <MdOutlineVpnKey size={20} />
            <p className={`${!open && "hidden"}`}>API Key</p>
          </button>
        </li>
        <li>
          <button
            className={`border border-slate-500 w-full flex ${open ? "items-center gap-2" : "justify-center"} p-2 rounded-md 
                      transition transform hover:-translate-y-1 hover:bg-opacity-50`}
            onClick={() => window.open("https://platform.openai.com/settings/organization/usage", "_blank")}
          >
            <MdOutlineAttachMoney size={20} />
            <p className={`${!open && "hidden"}`}>Costing</p>
          </button>
        </li>
        <li>
          <button
            className={`border border-slate-500 w-full flex ${open ? "items-center gap-2" : "justify-center"} p-2 rounded-md 
                      transition transform hover:-translate-y-1 hover:bg-opacity-50`}
            onClick={handleLogout}
          >
            <MdLogout size={20} />
            <p className={`${!open && "hidden"}`}>Logout</p>
          </button>
        </li>
      </ul>


      {/* Settings Modal */}
      <Modal title="API Connect" modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <Setting modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </Modal>

      {/* About Modal */}
      <Modal title="About MARX" modalOpen={aboutOpen} setModalOpen={setAboutOpen}>
        <AboutModal modalOpen={aboutOpen} setModalOpen={setAboutOpen} />
      </Modal>
    </section>
  );
};

export default SideBar;
