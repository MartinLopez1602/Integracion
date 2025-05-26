import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/WebpaySimulator.css';
import { CartContext } from '../../context/CartContext'; 

function WebpaySimulator() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { cart } = useContext(CartContext); 
  
  // Obtener parámetros de la URL
  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  const amount = params.get('amount');
  
  const handleSuccess = async () => {
    setLoading(true);

    try {
      // First save the order
      const estadosResponse = await axios.get('https://ferremas-app-env-2.eba-dqgxevfn.us-east-1.elasticbeanstalk.com/api/pedidos/estados');
      const estadoId = estadosResponse.data?.length > 0 ? estadosResponse.data[0].id_estado_ped : 1;
      
      const pedidoData = {
        cliente_id: 1,
        estado_id: estadoId,
        productos: cart.map(item => ({
          producto_id: item.id_prod,
          cantidad: item.quantity,
          precio_unitario: item.precio_prod
        }))
      };
      
      // Save the order first
      await axios.post('https://ferremas-app-env-2.eba-dqgxevfn.us-east-1.elasticbeanstalk.com/api/pedidos', pedidoData);
      
      // CHANGE THIS PART - Instead of using Axios, redirect the browser window directly
      // This will follow the server-side redirect properly
      window.location.href = `https://ferremas-app-env-2.eba-dqgxevfn.us-east-1.elasticbeanstalk.com/api/webpay/commit?token_ws=${token}`;
      
      // Remove the navigate call since the redirect will happen from the server
      // navigate(`/pago-exitoso?token=${token}`);
    } catch (error) {
      console.error('Error al procesar pago:', error);
      navigate('/pago-fallido');
      setLoading(false);
    }
  };
  
  const handleFailure = () => {
    navigate('/pago-fallido');
  };
  
  return (
    <div className="webpay-simulator">
      <div className="simulator-container">
        <h1>Simulador de Pago WebPay</h1>
        
        <div className="payment-details">
          <p><strong>Token:</strong> {token}</p>
          <p><strong>Monto:</strong> ${amount}</p>
        </div>
        
        <div className="card-info">
          <h3>Información de Tarjeta (Simulación)</h3>
          <div className="form-group">
            <label>Número de Tarjeta</label>
            <input type="text" defaultValue="4051 8856 0044 6623" disabled />
          </div>
          <div className="form-group">
            <label>Fecha Expiración</label>
            <input type="text" defaultValue="12/25" disabled />
          </div>
          <div className="form-group">
            <label>CVV</label>
            <input type="text" defaultValue="123" disabled />
          </div>
        </div>
        
        <div className="actions">
          <button 
            className="btn-success"
            onClick={handleSuccess}
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Aprobar Pago'}
          </button>
          <button 
            className="btn-danger"
            onClick={handleFailure}
            disabled={loading}
          >
            Rechazar Pago
          </button>
        </div>
      </div>
    </div>
  );
}

export default WebpaySimulator;