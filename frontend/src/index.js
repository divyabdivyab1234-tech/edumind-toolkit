import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // 1. Import the provider
import { BrowserRouter } from 'react-router-dom';
import "./App.css";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 2. THE PROVIDER MUST BE INSIDE BROWSERROUTER BUT OUTSIDE APP */}
      <AuthProvider> 
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);