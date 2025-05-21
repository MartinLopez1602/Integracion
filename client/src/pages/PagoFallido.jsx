import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './ResultadoPago.css';

function PagoFallido() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  return (
    <div className="resultado-pago fallido">
      <div className="resultado-container">
        <div className="resultado-icon">❌</div>
        <h1>Pago No Procesado</h1>
        <p>Hubo un problema al procesar tu pago.</p>
        {token && (
          <div className="token-info">
            <p>Referencia de transacción:</p>
            <code>{token}</code>
          </div>
        )}
        <div className="resultado-actions">
          <Link to="/carrito" className="btn-primary">Volver al carrito</Link>
          <Link to="/contacto" className="btn-secondary">Contactar soporte</Link>
        </div>
      </div>
    </div>
  );
}

export default PagoFallido;