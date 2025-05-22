import React from 'react';
import '../css/Promo.css';

function Promo() {
  return (
    <section className="promo-section">
      <h2 className="promo-title">¡Aprovecha nuestras promociones!</h2>
      <div className="promo-cards">
        <div className="promo-card">
          <h3>🚚 Despacho Gratis</h3>
          <p>En compras sobre $50.000 dentro de la Región Metropolitana.</p>
        </div>
        <div className="promo-card">
          <h3>🏷️ 10% Descuento en Tienda Física</h3>
          <p>Presenta este código <strong>FERRE10</strong> al pagar y obtén tu descuento exclusivo.</p>
        </div>
      </div>
    </section>
  );
}

export default Promo;
