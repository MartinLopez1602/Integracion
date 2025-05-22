import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // Habilita el enrutamiento, como en Angular :D
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>        {/* Aquí envuelves tu app con el router */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// No necesario, pero  para medir el rendimiento de la aplicación, por si acaso
reportWebVitals();

