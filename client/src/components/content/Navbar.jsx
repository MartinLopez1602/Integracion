import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import '../css/Navbar.css';

function Navbar() {
  const { itemCount } = useContext(CartContext);

  return (
    <nav className="navbar">
      <NavLink to="/" className="logo">FERREMAS</NavLink>
      <ul className="nav-links">
        <li>
          <NavLink to="/productos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Productos</NavLink>
        </li>
        <li>
          <NavLink to="/pedidos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Pedidos</NavLink>
        </li>
        <li>
          <NavLink to="/contacto" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Contacto</NavLink>
        </li>
        <li>
          <NavLink to="/carrito" className={({ isActive }) => isActive ? 'nav-link active cart-link' : 'nav-link cart-link'}>
            Carrito
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;