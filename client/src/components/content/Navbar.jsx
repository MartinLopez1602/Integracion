// src/components/content/Navbar.jsx
import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import Login    from './Login';
import Register from './Registro';
import '../css/Navbar.css';

function Navbar() {
  const { itemCount }          = useContext(CartContext);
  const { user, logout }       = useContext(AuthContext);
  const [loginOpen, setLoginOpen] = useState(false);
  const [regOpen,   setRegOpen]   = useState(false);

  return (
    <>
      <nav className="navbar">
        {/* --- Logo --- */}
        <div className="nav-brand">
          <NavLink to="/" className="logo">FERREMAS</NavLink>
        </div>

        <div className="navbar-toggle">
          <span className="bar"></span><span className="bar"></span><span className="bar"></span>
        </div>

        {/* --- enlaces principales --- */}
        <ul className="nav-links">
          <li><NavLink to="/productos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Productos</NavLink></li>
          <li><NavLink to="/pedidos"   className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Pedidos</NavLink></li>
          <li><NavLink to="/contacto"  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Contacto</NavLink></li>
          <li>
            <NavLink to="/carrito" className={({ isActive }) => isActive ? 'nav-link active cart-link' : 'nav-link cart-link'}>
              Carrito
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </NavLink>
          </li>
        </ul>

        {!user ? (
          /* botón login */
          <a href="#login" className="nav-link login-action" onClick={(e) => { e.preventDefault(); setLoginOpen(true); }}>Iniciar Sesión</a>
        ) : (
          /* usuario autenticado */
          <div className="auth-links">
            <NavLink to="/perfil" className="nav-link">Perfil</NavLink>
            <span className="nav-link" style={{ cursor: 'pointer' }} onClick={logout}>
              Cerrar Sesión
            </span>
          </div>)}
      </nav>
      {/* Modales de Login y Registro */}
      <Login isOpen={loginOpen} onClose={() => setLoginOpen(false)} onSwitch={() => {setLoginOpen(false);setRegOpen(true);}}/>
      <Register isOpen={regOpen} onClose={() => setRegOpen(false)} onSwitch={() => {setRegOpen(false);setLoginOpen(true);}}/>
    </>
  );
}

export default Navbar;
