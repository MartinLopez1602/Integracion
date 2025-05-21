import React from 'react';
import { Routes, Route } from 'react-router-dom';

//componentes reutilizables
import Navbar from './components/Navbar';

//paginas
import Productos from './pages/Productos';
import Pedidos from './pages/Pedidos';
import Contacto from './pages/Contacto';
import Home from './pages/Home';

// enruta las paginas, como se hace en Angular, copia y pega otro nomas y le cambias el nombre
function App() {
  return (
    <>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
    </>
  );
}

export default App;

