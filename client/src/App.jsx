import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';

import Productos from './pages/Productos';
import Pedidos from './pages/Pedidos';
import Contacto from './pages/Contacto';

function App() {
  return (
    <>
      <Navbar />
      <HeroBanner />

      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Productos />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

