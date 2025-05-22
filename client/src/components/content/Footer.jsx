import React from 'react';
import '../css/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Ferremás</h4>
          <p>Tu ferretería de confianza con más de 15 años de experiencia.</p>
        </div>
        <div className="footer-section">
          <h4>Enlaces</h4>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/productos">Productos</a></li>
            <li><a href="/contacto">Contacto</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contacto</h4>
          <p>Av. Siempre Viva 123</p>
          <p>+56 9 1234 5678</p>
          <p>contacto@ferremas.cl</p>
        </div>
      </div>
      <div className="footer-bottom">
        © 2025 Ferremas. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;
