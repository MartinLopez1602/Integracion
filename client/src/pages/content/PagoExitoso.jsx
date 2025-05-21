import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import '../css/ResultadoPago.css';

function PagoExitoso() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { clearCart } = useContext(CartContext);
  
  useEffect(() => {
    // Limpiamos el carrito al recibir un pago exitoso
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return (
    <div className="resultado-pago exitoso">
      <div className="resultado-container">
        <div className="resultado-icon">✅</div>
        <h1>¡Pago Exitoso!</h1>
        <p>Tu pedido ha sido procesado correctamente.</p>
        {token && (
          <div className="token-info">
            <p>Número de transacción:</p>
            <code>{token}</code>
          </div>
        )}
        <div className="resultado-actions">
          <button 
            className="btn-primary" 
            onClick={() => navigate('/productos')}
          >
            Seguir comprando
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => navigate('/pedidos')}
          >
            Ver mis pedidos
          </button>
        </div>
      </div>
    </div>
  );
}

export default PagoExitoso;