import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/ProductoDestacado.css';

function FeaturedProducts() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios.get('https://ferremas-app-env-2.eba-dqgxevfn.us-east-1.elasticbeanstalk.com/api/producto/destacados')
      .then(res => setProductos(res.data))
      .catch(err => console.error('Error al cargar productos destacados:', err));
  }, []);

  return (
    <section className="featured-section">
      <h2 className="featured-title">Productos Destacados</h2>
      <div className="featured-grid">
        {productos.map(p => (
          <div key={p.id_prod} className="featured-card">
            <img 
              src={`https://ferremas-app-env-2.eba-dqgxevfn.us-east-1.elasticbeanstalk.com/images/${p.imagen_url ? p.imagen_url.split('/').pop() : 'Alargador.png'}`} 
              alt={p.nombre_prod} 
              className="producto-imagen" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://ferremas-app-env-2.eba-dqgxevfn.us-east-1.elasticbeanstalk.com/images/Alargador.png';
              }}
            />
            <h4>{p.nombre_prod}</h4>
            <p>${p.precio_prod}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;