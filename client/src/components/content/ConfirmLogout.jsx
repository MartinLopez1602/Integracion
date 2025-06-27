import React, { useState } from 'react';
import '../css/Login.css'; // Reutilizamos los estilos del modal de login

export default function ConfirmLogout({ isOpen, onClose, onConfirm }) {
  const [closing, setClosing] = useState(false);

  if (!isOpen && !closing) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 300);
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <div
      className={`login-overlay ${closing ? 'closing' : ''}`}
      onClick={handleClose}
    >
      <div
        className={`login-card ${closing ? 'closing' : 'modal-animation'}`}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '350px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚪</div>
          <h2 className="login-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Confirmar Cierre de Sesión
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
            ¿Estás seguro que quieres cerrar tu sesión?
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
          <button 
            onClick={handleConfirm}
            className="btn btn-login"
            style={{ backgroundColor: '#dc2626' }}
          >
            Sí, cerrar sesión
          </button>
          <button 
            onClick={handleClose}
            className="btn"
            style={{ 
              backgroundColor: '#64748b',
              color: 'white'
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}