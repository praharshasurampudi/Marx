import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import ReactGA from 'react-ga4';
import "regenerator-runtime/runtime";
import AuthProvider from './context/AuthProvider.jsx';
import { BrowserRouter } from 'react-router-dom';

ReactGA.initialize(`${import.meta.env.VITE_GOOGLE_ANALYTICS_KEY}`);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    
    <AuthProvider>
      <App />
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
