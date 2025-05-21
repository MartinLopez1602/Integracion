import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Productos.css'; // Reusing the productos styling for now

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real implementation, you would fetch pedidos data
    setLoading(false);
  }, []);

  return (
    <div className="productos-container">
      <h2 className="productos-title">Mis Pedidos</h2>
      
      {loading && (
        <div className="loading-message">
          <p>Cargando pedidos...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && pedidos.length === 0 && (
        <div className="no-productos-message">
          <p>No tienes pedidos activos en este momento.</p>
          <p>Realiza una compra para ver tus pedidos aquí.</p>
        </div>
      )}
    </div>
  );
}

export default Pedidos;