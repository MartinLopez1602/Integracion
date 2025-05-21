import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

//componentes reutilizables
import Navbar from './components/Navbar';

//paginas
import Productos from '../src/pages/content/Productos';
import Pedidos from '../src/pages/content/Pedidos';
import Contacto from '../src/pages/content/Contacto';
import Home from '../src/pages/content/Home';
import Carrito from '../src/pages/content/Carrito';

// enruta las paginas, como se hace en Angular, copia y pega otro nomas y le cambias el nombre
function App() {
  return (
    <CartProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/carrito" element={<Carrito />} />
      </Routes>
    </CartProvider>
  );
}

export default App;

