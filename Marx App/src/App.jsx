import { ChatContextProvider } from './context/chatContext';
import SideBar from './components/SideBar';
import ChatView from './components/ChatView';
import { useContext, useEffect, useState } from 'react';
import Modal from './components/Modal';
import Setting from './components/Setting';
import SignUp from './components/SignUp';
import { AuthContext } from './context/AuthProvider';

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const apiKey = window.localStorage.getItem('api-key');
    if (!apiKey) {
      setModalOpen(true);
    }
  }, []);

  return (
    <ChatContextProvider>
      {user ? ( 
        <>
          <Modal title='Setting' modalOpen={modalOpen} setModalOpen={setModalOpen}>
            <Setting modalOpen={modalOpen} setModalOpen={setModalOpen} />
          </Modal>
          <div className='flex transition duration-500 ease-in-out'> 
            <ChatView />
            <SideBar />
          </div>
        </>
      ) : (
        <SignUp />
      )}
    </ChatContextProvider>
  );
};

export default App;
