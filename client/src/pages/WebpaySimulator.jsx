import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './WebpaySimulator.css';

function WebpaySimulator() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Obtener parámetros de la URL
  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  const amount = params.get('amount');
  
    // In the handleSuccess function:
    const handleSuccess = async () => {
        setLoading(true);
        try {
            // First navigate to success page
            navigate(`/pago-exitoso?token=${token}`);
            
            // Make sure we're passing token_ws parameter exactly as the API expects it
            await axios.get(`http://localhost:5000/api/webpay/commit`, {
                params: { token_ws: token }
            })
            .catch(err => console.log('Background notification error:', err));
        } catch (error) {
            console.error('Error al procesar pago:', error);
            navigate('/pago-fallido');
        } finally {
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