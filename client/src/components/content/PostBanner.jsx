import React from 'react';
import '../css/PostBanner.css';

function Preferirnos() {
  return (
    <section className="preferirnos-section">
      <div className="preferirnos-header">
        <div className="rating-stars">
          ⭐ ⭐ ⭐ ⭐ ⭐ <span>4.84 <small>(50+ valoraciones)</small></span>
        </div>
        <h2>
          Más de <span className="highlight">3600+</span> clientes nos prefieren para su ferretería online.
        </h2>
        <p>
          Creamos componentes React reutilizables para que desarrolles tu proyecto de e-commerce con rapidez.
          Nuestra arquitectura utiliza PostgreSQL, Express y React, permitiendo una escalabilidad real en cualquier entorno.
        </p>
      </div>

      <div className="preferirnos-benefits">
        <div className="benefit-box">
          <img src="/images/star.png" alt="Estrella" />
          <h4>Alta puntuación</h4>
          <p>Una de las plantillas de e-commerce más valoradas por su facilidad y rendimiento.</p>
        </div>
        <div className="benefit-box">
          <img src="/images/discount.png" alt="Descuento" />
          <h4>Liderazgo en ventas</h4>
          <p>Con más de 3600+ ventas, somos referencia en soluciones digitales para ferreterías.</p>
        </div>
        <div className="benefit-box">
          <img src="/images/deploy.png" alt="Deploy" />
          <h4>Fácil de desplegar</h4>
          <p>Incluye guías para implementar tu tienda en diversos entornos sin complicaciones.</p>
        </div>
        <div className="benefit-box">
          <img src="/images/support.png" alt="Soporte" />
          <h4>Soporte ágil</h4>
          <p>Respuesta rápida y resolutiva para asegurar tu satisfacción en todo momento.</p>
        </div>
      </div>
    </section>
  );
}

export default Preferirnos;
