import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // Habilita el enrutamiento, como en Angular :D
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthProvider from './context/AuthContext'; // Importa el proveedor de autenticación

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
reportWebVitals();

