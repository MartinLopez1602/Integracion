import React from 'react';
import HeroBanner from '../../components/content/HeroBanner';
import PostBanner from '../../components/content/PostBanner';
import ProductoDestacado from '../../components/content/ProductoDestacado';
import Promo from '../../components/content/Promo';

function Home() {
  return (
    <main>
      <HeroBanner />
      <PostBanner />
      <ProductoDestacado />
      <Promo />
    </main>
  );
}

export default Home;
