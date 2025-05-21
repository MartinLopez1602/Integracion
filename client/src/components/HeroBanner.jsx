import React from 'react';
import './HeroBanner.css';

function HeroBanner() {
  return (
    <section className="hero-banner">
      <div className="hero-text">
        <p className="sub-title">New Hot Cosmetics</p>
        <h1 className="main-title">
          <span className="vertical-text">UP TO</span> 50% OFF
        </h1>
        <p className="price-text">STARTING AT <span>$1<sup>99</sup></span></p>
        <button className="btn-shop">SHOP NOW →</button>
      </div>
      <div className="hero-image">
        <img src="/images/banner-face.jpg" alt="Banner" />
      </div>
    </section>
  );
}

export default HeroBanner;
