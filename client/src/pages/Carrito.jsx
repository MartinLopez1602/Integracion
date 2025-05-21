import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './Carrito.css';

function Cart() {
  const { cart, total, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Tu carrito está vacío</h2>
        <p>¿Qué esperas para agregar productos?</p>
        <Link to="/productos" className="btn-primary">Ver productos</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">Tu Carrito de Compras</h2>
      
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id_prod} className="cart-item">
            <div className="cart-item-img">
              <span className="cart-item-icon">🔨</span>
            </div>
            <div className="cart-item-details">
              <h3>{item.nombre_prod}</h3>
              <span className="cart-item-categoria">{item.tipo_producto || 'Sin categoría'}</span>
            </div>
            <div className="cart-item-price">
              ${item.precio_prod}
            </div>
            <div className="cart-item-quantity">
              <button 
                onClick={() => updateQuantity(item.id_prod, item.quantity - 1)}
                className="quantity-btn"
              >-</button>
              <span>{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id_prod, item.quantity + 1)}
                className="quantity-btn"
              >+</button>
            </div>
            <div className="cart-item-subtotal">
              ${(item.precio_prod * item.quantity).toFixed(2)}
            </div>
            <button 
              onClick={() => removeFromCart(item.id_prod)}
              className="cart-item-remove"
            >×</button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="cart-total">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="cart-actions">
          <button onClick={clearCart} className="btn-secondary">Vaciar carrito</button>
          <button className="btn-primary">Proceder al pago</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;