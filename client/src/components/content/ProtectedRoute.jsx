import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user } = useContext(AuthContext);

  // Si no hay usuario autenticado
  if (!user) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        minHeight: '60vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center' 
      }}>
        <h2>🔒 Acceso Restringido</h2>
        <p>Debes iniciar sesión para acceder a esta página.</p>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Por favor, haz clic en "Iniciar Sesión" en la parte superior de la página.
        </p>
      </div>
    );
  }

  // Si hay roles específicos requeridos y el usuario no los tiene
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        minHeight: '60vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center' 
      }}>
        <h2>⛔ Sin Permisos</h2>
        <p>No tienes permisos para acceder a esta página.</p>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Tu rol actual: <strong>{user.rol}</strong>
        </p>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Roles requeridos: <strong>{allowedRoles.join(', ')}</strong>
        </p>
      </div>
    );
  }

  // Si todo está bien, renderizar el componente hijo
  return children;
}

export default ProtectedRoute;