import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/Carrito.css';

function Cart() {
  const { cart, total, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const iniciarPago = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const buyOrder = `OC-${Date.now()}`;
      const sessionId = `S-${Date.now()}`;
      
      // Mantén la URL del servidor local para la API
      const response = await axios.post(`${API_BASE_URL}/api/webpay/create`, {
        buyOrder,
        sessionId,
        amount: total,
        returnUrl : `${API_BASE_URL}/api/webpay/commit`,
      });

      window.location.href = response.data.url;
      
    } catch (err) {
      console.error('Error al iniciar el pago:', err);
      setError('Ocurrió un error al procesar el pago. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

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
      
      {/* Resto del código actual */}
      <div className="cart-items">
    {cart.map(item => (
      <div key={item.id_prod} className="cart-item">
        <div className="cart-item-img">
          <span className="cart-item-icon">📦</span>
        </div>
        <div className="cart-item-details">
          <h3>{item.nombre_prod}</h3>
          <span className="cart-item-categoria">{item.tipo_producto || 'General'}</span>
        </div>
        <div className="cart-item-price">${item.precio_prod}</div>
        <div className="cart-item-quantity">
          <button 
            className="quantity-btn" 
            onClick={() => updateQuantity(item.id_prod, item.quantity - 1)}
          >-</button>
          <span>{item.quantity}</span>
          <button 
            className="quantity-btn" 
            onClick={() => updateQuantity(item.id_prod, item.quantity + 1)}
          >+</button>
        </div>
        <div className="cart-item-subtotal">
          ${(item.precio_prod * item.quantity).toFixed(2)}
        </div>
        <button 
          className="cart-item-remove" 
          onClick={() => removeFromCart(item.id_prod)}
        >×</button>
      </div>
    ))}
  </div>
      
      <div className="cart-summary">
        <div className="cart-total">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="cart-actions">
          <button onClick={clearCart} className="btn-secondary">Vaciar carrito</button>
          <button 
            onClick={iniciarPago} 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Pagar con WebPay'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;