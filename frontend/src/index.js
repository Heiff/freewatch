import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/css/App.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ContextProvider } from './Context';
import { HelmetProvider } from "react-helmet-async";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <HelmetProvider>
    <BrowserRouter>
    <ContextProvider>
      <App/>
    </ContextProvider>
  </BrowserRouter>
  </HelmetProvider>
  
);
