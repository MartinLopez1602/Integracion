import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../css/Productos.css';
import { CartContext } from '../../context/CartContext';
import FiltroPanel from '../../components/content/FiltroPanel';

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
          axios.get('http://localhost:5000/api/producto'),
          axios.get('http://localhost:5000/api/tipo-producto')
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

  const isStockAvailable = (producto) => {
    const itemInCart = cart.find(item => item.id_prod === producto.id_prod);
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;
    return quantityInCart < producto.stock_prod;
  };

  const handleAddToCart = (producto) => {
    if (!isStockAvailable(producto)) {
      const errorId = `error-${producto.id_prod}`;
      const errorMsg = {
        id: errorId,
        nombre: producto.nombre_prod,
        error: true,
        message: `No hay más unidades disponibles de este producto (Stock: ${producto.stock_prod})`
      };

      setMensajes(prev => {
        const existe = prev.find(m => m.id === errorId);
        return existe ? prev : [...prev, errorMsg];
      });

      setTimeout(() => {
        setMensajes(current => current.filter(m => m.id !== errorId));
      }, 3000);
      return;
    }

    addToCart(producto);

    const successId = `success-${producto.id_prod}`;
    setMensajes(prev => {
      const idx = prev.findIndex(m => m.id === successId);
      if (idx !== -1) {
        const actualizado = [...prev];
        actualizado[idx].cantidad += 1;
        return actualizado;
      } else {
        return [
          ...prev,
          {
            id: successId,
            nombre: producto.nombre_prod,
            cantidad: 1,
            error: false
          }
        ];
      }
    });

    setTimeout(() => {
      setMensajes(current => current.filter(m => m.id !== successId));
    }, 3000);
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
          <div
            key={mensaje.id}
            className={`toast ${mensaje.error ? 'toast-error' : 'toast-success'}`}
          >
            <span>
              {mensaje.error
                ? mensaje.message
                : `${mensaje.nombre} agregado x${mensaje.cantidad}`}
            </span>
            <button className="toast-close" onClick={() => handleCerrarMensaje(mensaje.id)}>×</button>
          </div>
        ))}
      </div>

      <div className="productos-container">
        <h2 className="productos-title">Catálogo de Productos</h2>

        <div className="filtros-barra-superior">
          <FiltroPanel
            tipos={tipos}
            setCategoriaSeleccionada={setCategoriaSeleccionada}
          />
        </div>

        {loading && <div className="loading-message"><p>Cargando productos...</p></div>}
        {error && <div className="error-message"><p>{error}</p></div>}

        <div className="productos-grid">
          {productosFiltrados.map(producto => {
            const itemInCart = cart.find(item => item.id_prod === producto.id_prod);
            const quantityInCart = itemInCart ? itemInCart.quantity : 0;
            const remainingStock = producto.stock_prod - quantityInCart;

            return (
              <button
                key={producto.id_prod}
                className="producto-card-button"
                onClick={() => handleAddToCart(producto)}
                disabled={remainingStock <= 0}
              >
                <div className="producto-card">
                  <div className="producto-img-container">
                    <img
                      src={`http://localhost:5000/images/${producto.imagen_url ? producto.imagen_url.split('/').pop() : 'Alargador.png'}`}
                      alt={producto.nombre_prod}
                      className="producto-imagen"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'http://localhost:5000/images/Alargador.png';
                      }}
                    />
                    <div className="hover-overlay">
                      <p>Agregar<br />al<br />carrito</p>
                    </div>
                  </div>
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
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Productos;
