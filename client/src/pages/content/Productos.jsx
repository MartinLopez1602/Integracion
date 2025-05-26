import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../css/Productos.css';
import { CartContext } from '../../context/CartContext';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const { addToCart, cart } = useContext(CartContext);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        setLoading(true);
        const [productosRes, tiposRes] = await Promise.all([
          axios.get('http://ferremas-app-env-2.eba-dqgxevfn.us-east-1.elasticbeanstalk.com//api/producto'),
          axios.get('http://ferremas-app-env-2.eba-dqgxevfn.us-east-1.elasticbeanstalk.com//api/tipo-producto')
        ]);
        setProductos(productosRes.data);
        setTipos(tiposRes.data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar productos o tipos:', err);
        setError('Error al cargar los productos. Por favor intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, []);

  //funcion para ver  si excede el stock en el carrito
  const isStockAvailable = (producto) => {
    const itemInCart = cart.find(item => item.id_prod === producto.id_prod);
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;
    return quantityInCart < producto.stock_prod;
  };

  const handleAddToCart = (producto) => {
    // Check if adding one more would exceed stock
    if (!isStockAvailable(producto)) {
      // Show error message
      setMensajes(prevMensajes => {
        const errorMsg = {
          id: `error-${producto.id_prod}`,
          nombre: producto.nombre_prod,
          error: true,
          message: `No hay más unidades disponibles de este producto (Stock: ${producto.stock_prod})`
        };

        setTimeout(() => {
          setMensajes(current => current.filter(m => m.id !== errorMsg.id));
        }, 3000);

        return [...prevMensajes, errorMsg];
      });
      return;
    }

    // If stock is available, proceed with adding to cart
    addToCart(producto);

    setMensajes(prevMensajes => {
      const existente = prevMensajes.find(m => m.id === producto.id_prod);

      if (existente) {
        return prevMensajes.map(m =>
          m.id === producto.id_prod
            ? { ...m, cantidad: m.cantidad + 1 }
            : m
        );
      } else {
        const nuevo = {
          id: producto.id_prod,
          nombre: producto.nombre_prod,
          cantidad: 1,
          error: false
        };

        setTimeout(() => {
          setMensajes(current => current.filter(m => m.id !== producto.id_prod));
        }, 3000);

        return [...prevMensajes, nuevo];
      }
    });
  };

  const handleCerrarMensaje = (id) => {
    setMensajes(prev => prev.filter(m => m.id !== id));
  };

  const productosFiltrados = categoriaSeleccionada
    ? productos.filter(p => p.tipo_producto === categoriaSeleccionada)
    : productos;

  return (
    <div className="productos-wrapper">
      <div className="toast-container">
        {mensajes.map(mensaje => (
          <div key={mensaje.id} className={`toast ${mensaje.error ? 'toast-error' : ''}`}>
            <span>{mensaje.error ? mensaje.message : `${mensaje.nombre} agregado x${mensaje.cantidad}`}</span>
            <button className="toast-close" onClick={() => handleCerrarMensaje(mensaje.id)}>×</button>
          </div>
        ))}
      </div>

      <div className="productos-container">
        <h2 className="productos-title">Catálogo de Productos</h2>

        <div className="filtro-categorias">
          <label htmlFor="categoria">Filtrar por categoría:</label>
          <select 
            id="categoria" 
            value={categoriaSeleccionada} 
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          >
            <option value="">Todas</option>
            {tipos.map(tipo => (
              <option key={tipo.id_tipoprod} value={tipo.nombre_tipoprod}>
                {tipo.nombre_tipoprod}
              </option>
            ))}
          </select>
        </div>

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
          {productosFiltrados.map(producto => {
            const itemInCart = cart.find(item => item.id_prod === producto.id_prod);
            const quantityInCart = itemInCart ? itemInCart.quantity : 0;
            const remainingStock = producto.stock_prod - quantityInCart;
            
            return (
              <div key={producto.id_prod} className="producto-card">
                <img 
                  src={`http://ferremas-app-env-2.eba-dqgxevfn.us-east-1.elasticbeanstalk.com//images/${producto.imagen_url ? producto.imagen_url.split('/').pop() : 'Alargador.png'}`} 
                  alt={producto.nombre_prod} 
                  className="producto-imagen" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'http://ferremas-app-env-2.eba-dqgxevfn.us-east-1.elasticbeanstalk.com//images/Alargador.png';
                  }}
                />
                <div className="producto-info">
                  <h3>{producto.nombre_prod}</h3>
                  <span className="producto-categoria">{producto.tipo_producto || 'Sin categoría'}</span>
                  <div className="producto-details">
                    <span className="producto-precio">${producto.precio_prod}</span>
                    <span className={`producto-stock ${remainingStock <= 0 ? 'agotado' : remainingStock <= 5 ? 'bajo-stock' : ''}`}>
                      Stock: <strong>{producto.stock_prod}</strong>
                      {quantityInCart > 0 && <span> (En carrito: {quantityInCart})</span>}
                    </span>
                  </div>
                  <button 
                    className={`producto-btn ${remainingStock <= 0 ? 'disabled' : ''}`}
                    onClick={() => handleAddToCart(producto)}
                    disabled={remainingStock <= 0}
                  >
                    {remainingStock <= 0 ? 'Sin stock' : 'Agregar al carrito'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {productosFiltrados.length === 0 && !loading && !error && (
          <div className="no-productos-message">
            <p>No hay productos disponibles en esta categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Productos;