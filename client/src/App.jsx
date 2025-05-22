import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

//componentes reutilizables
import Layout from '../src/components/content/Layout';

//paginas
import Productos from '../src/pages/content/Productos';
import Pedidos from '../src/pages/content/Pedidos';
import Contacto from '../src/pages/content/Contacto';
import Home from '../src/pages/content/Home';
import Carrito from '../src/pages/content/Carrito';
import PagoExitoso from '../src/pages/content/PagoExitoso';
import PagoFallido from '../src/pages/content/PagoFallido';
import WebpaySimulator from '../src/pages/content/WebpaySimulator';

// enruta las paginas, como se hace en Angular, copia y pega otro nomas y le cambias el nombre
function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="productos" element={<Productos />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="carrito" element={<Carrito />} />
          <Route path="pago-exitoso" element={<PagoExitoso />} />
          <Route path="pago-fallido" element={<PagoFallido />} />
          <Route path="webpay-simulator" element={<WebpaySimulator />} />
        </Route>
      </Routes>
    </CartProvider>
  );
}

export default App;

