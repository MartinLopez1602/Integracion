import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Pedidos.css';

function Pedidos() {
  const [ordersGroups, setOrdersGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://ferremas-app-env.eba-cmwanbjq.us-east-1.elasticbeanstalk.com/api/pedidos');
        setOrdersGroups(response.data);
        setError(null);
      } catch (err) {
        console.error('Error al obtener pedidos:', err);
        setError('No se pudieron cargar los pedidos. Por favor intente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="orders-loading">Cargando pedidos...</div>;
  if (error) return <div className="orders-error">{error}</div>;
  if (ordersGroups.length === 0) return <div className="no-orders">No hay pedidos disponibles</div>;

  return (
    <section className="orders-section">
      <div className="orders-container">
        <h2 className="orders-title">Pedidos Recientes</h2>
        
        {ordersGroups.map(group => (
          <div key={group.status_id} className="order-group">
            <h3 className="order-status-title">{group.status_name}</h3>
            <p className="order-status-desc">{group.status_description}</p>
            
            <div className="order-list">
              {group.orders.map(order => (
                <div key={order.id_pedido} className="order-card">
                  <div className="order-header">
                    <span className="order-id">Pedido #{order.id_pedido}</span>
                    <span className="order-date">
                      {new Date(order.fecha_pedido).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className="order-details">
                    <h4>Productos:</h4>
                    <ul className="order-products">
                      {order.detalles.map(item => (
                        <li key={item.id_detalle}>
                          {item.cantidad} x {item.nombre_producto || `Producto #${item.producto_id}`} - ${item.precio_unit} c/u
                        </li>
                      ))}
                    </ul>
                    
                    <div className="order-total">
                      Total: ${order.detalles.reduce((sum, item) => sum + parseFloat(item.precio_total), 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Pedidos;