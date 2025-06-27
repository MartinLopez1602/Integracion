import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL, buildApiUrl, buildImageUrl } from '../../config/config';
import '../css/ProductoDestacado.css';

function FeaturedProducts() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductosDestacados();
    
    // Configurar polling para actualizar cada 30 segundos
    const interval = setInterval(fetchProductosDestacados, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchProductosDestacados = async () => {
    try {
      const response = await axios.get(buildApiUrl("/api/producto/destacados"));
      setProductos(response.data);
    } catch (err) {
      console.error('Error al cargar productos destacados:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="featured-section">
        <h2 className="featured-title">Productos Destacados</h2>
        <div className="featured-loading">
          <p>Cargando productos destacados...</p>
        </div>
      </section>
    );
  }

  if (productos.length === 0) {
    return (
      <section className="featured-section">
        <h2 className="featured-title">Productos Destacados</h2>
        <div className="featured-empty">
          <p>No hay productos destacados en este momento.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-section">
      <h2 className="featured-title">Productos Destacados</h2>
      <div className="featured-grid">
        {productos.map(p => (
          <div key={p.id_prod} className="featured-card">
            <div className="featured-badge">⭐ Destacado</div>
            <img 
              src={buildImageUrl(`${p.imagen_url?.split('/').pop() || 'Alargador.png'}`)} 
              alt={p.nombre_prod} 
              className="producto-imagen" 
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = buildImageUrl('Alargador.png'); 
              }}
            />
            <div className="featured-info">
              <h4>{p.nombre_prod}</h4>
              <p className="featured-price">${p.precio_prod}</p>
              <p className="featured-stock">Stock: {p.stock_prod}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;