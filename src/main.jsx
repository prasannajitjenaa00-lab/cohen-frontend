import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import config from './config';
import App from './App.jsx';
import './index.css';

if (config.apiServerUrl) {
  axios.defaults.baseURL = config.apiServerUrl;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
