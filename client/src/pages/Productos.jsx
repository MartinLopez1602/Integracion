import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './Productos.css';
import { CartContext } from '../context/CartContext';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext); 

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/producto');
        setProductos(response.data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('Error al cargar los productos. Por favor intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Función para manejar el clic en "Agregar al carrito"
  const handleAddToCart = (producto) => {
    addToCart(producto);
    alert(`${producto.nombre_prod} agregado al carrito`);
  };

  return (
    <div className="productos-container">
      <h2 className="productos-title">Catálogo de Productos</h2>
      
      {loading && (
        <div className="loading-message">
          <p>Cargando productos...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      <div className="productos-grid">
        {productos.map(producto => (
          <div key={producto.id_prod} className="producto-card">
            {/* código existente */}
            <div className="producto-info">
              <h3>{producto.nombre_prod}</h3>
              <span className="producto-categoria">{producto.tipo_producto || 'Sin categoría'}</span>
              <div className="producto-details">
                <span className="producto-precio">${producto.precio_prod}</span>
                <span className="producto-stock">
                  Stock: <strong>{producto.stock_prod}</strong>
                </span>
              </div>
              <button 
                className="producto-btn"
                onClick={() => handleAddToCart(producto)} // Usar la función
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {productos.length === 0 && !loading && !error && (
        <div className="no-productos-message">
          <p>No hay productos disponibles en este momento.</p>
        </div>
      )}
    </div>
  );
}

export default Productos;