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
          Más de <span className="highlight">3600+</span> clientes nos prefieren como Ferreteria!
        </h2>
        <p>
        Ferremás es una ferretería local con más de 15 años de experiencia.<br />
        Nos destacamos por ofrecer productos de calidad, asesoría experta y un servicio cercano y confiable.<br />
        Nuestra misión es ser el aliado preferido de profesionales y familias en cada proyecto.<br />
        En Ferremás<br />¡tu confianza es nuestra herramienta más valiosa!
        </p>
      </div>

      <div className="preferirnos-benefits">
        <div className="benefit-box">
          <img src="/images/star.png" alt="Estrella" />
          <h4>Alta puntuación</h4>
          <p>Porque nuestros consumidores, nos prefieren sobre la competencia!</p>
        </div>
        <div className="benefit-box">
          <img src="/images/discount.png" alt="Descuento" />
          <h4>Liderazgo en ventas</h4>
          <p>Ofreciendo los mejores descuentos y promociones que otras ferreterias</p>
        </div>
        <div className="benefit-box">
          <img src="/images/deploy.png" alt="Deploy" />
          <h4>Miles de productos</h4>
          <p>Incluimos una alta variedad de productos en nuestro catalogo!</p>
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
