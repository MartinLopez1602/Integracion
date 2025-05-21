import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

//componentes reutilizables
import Navbar from './components/Navbar';

//paginas
import Productos from './pages/Productos';
import Pedidos from './pages/Pedidos';
import Contacto from './pages/Contacto';
import Home from './pages/Home';
import Carrito from './pages/Carrito';
import PagoExitoso from './pages/PagoExitoso';
import PagoFallido from './pages/PagoFallido';
import WebpaySimulator from './pages/WebpaySimulator';

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
        <Route path="/pago-exitoso" element={<PagoExitoso />} />
        <Route path="/pago-fallido" element={<PagoFallido />} />
        <Route path="/webpay-simulator" element={<WebpaySimulator />} />
      </Routes>
    </CartProvider>
  );
}

export default App;

