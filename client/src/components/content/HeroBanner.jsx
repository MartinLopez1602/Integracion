import React from 'react';
import '../css/HeroBanner.css';
import bannerImg from '../../assets/images/hero-ferreteria.jpg';
import logoImg from '../../assets/images/logo-ferreteria.png';

function HeroBanner() {
  return (
    <section className="hero-banner" style={{ backgroundImage: `url(${bannerImg})` }}>
      <div className="hero-overlay">
        <div className="hero-content-centered">
          <img src={logoImg} alt="Logo FERREMAS" className="hero-logo" />
          <h1 className="hero-title">FERREMAS</h1>
          <p className="hero-subtitle">Todo lo que necesitas para construir, reparar y crear, en un solo lugar.</p>
          <button className="hero-button">Comprar ahora</button>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;