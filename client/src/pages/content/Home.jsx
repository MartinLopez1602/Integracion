import React from 'react';
import HeroBanner from '../../components/content/HeroBanner';
import PostBanner from '../../components/content/PostBanner';
import ProductoDestacado from '../../components/content/ProductoDestacado';

function Home() {
  return (
    <main>
      <HeroBanner />
      <PostBanner />
      <ProductoDestacado />
    </main>
  );
}

export default Home;
