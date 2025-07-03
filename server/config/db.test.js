const path = require('path');

// Store para simular datos persistentes durante la sesión de pruebas
let mockStock = {
  1: 0,   // Taladro - sin stock para probar error
  5: 100  // Interruptor doble - con stock para probar creación exitosa
};

// Mock del pool de base de datos para testing
const mockPool = {
  connect: async () => {
    const client = {
      query: async (text, params) => {
        // Mock de datos para testing
        if (text.includes('SELECT') && text.includes('producto') && text.includes('id_prod = $1')) {
          // Mock para obtener producto específico
          const id = params[0];
          const mockProducts = {
            1: { id_prod: 1, nombre_prod: 'Taladro', precio_prod: '49990.00', stock_prod: mockStock[1], tipo_producto: 'Herramientas' },
            5: { id_prod: 5, nombre_prod: 'Interruptor doble', precio_prod: '2990.00', stock_prod: mockStock[5], tipo_producto: 'Eléctricos' }
          };
          return { rows: mockProducts[id] ? [mockProducts[id]] : [] };
        }
        
        if (text.includes('SELECT') && text.includes('producto') && text.includes('LEFT JOIN') && !text.includes('id_prod = $1')) {
          // Mock para obtener lista de productos
          return {
            rows: [
              { id_prod: 1, nombre_prod: 'Taladro', precio_prod: '49990.00', stock_prod: mockStock[1], tipo_producto: 'Herramientas' },
              { id_prod: 5, nombre_prod: 'Interruptor doble', precio_prod: '2990.00', stock_prod: mockStock[5], tipo_producto: 'Eléctricos' }
            ]
          };
        }
        
        if (text.includes('SELECT nombre_prod, stock_prod FROM producto WHERE id_prod = $1')) {
          // Mock para verificar stock en pedidos - esta es la consulta clave
          const id = params[0];
          const mockProducts = {
            1: { nombre_prod: 'Taladro', stock_prod: mockStock[1] },
            5: { nombre_prod: 'Interruptor doble', stock_prod: mockStock[5] }
          };
          return { rows: mockProducts[id] ? [mockProducts[id]] : [] };
        }
        
        if (text.includes('SELECT') && text.includes('tipo_producto')) {
          // Mock para tipos de producto
          return {
            rows: [
              { id_tipoprod: 1, nombre_tipoprod: 'Herramientas', desc_tipoprod: 'Herramientas de construcción' },
              { id_tipoprod: 2, nombre_tipoprod: 'Eléctricos', desc_tipoprod: 'Productos eléctricos' }
            ]
          };
        }
        
        if (text.includes('INSERT INTO pedido')) {
          // Mock para crear pedido
          return { rows: [{ id_pedido: 123 }] };
        }
        
        if (text.includes('INSERT INTO detalle_pedido')) {
          // Mock para detalle de pedido
          return { rows: [{}] };
        }
        
        if (text.includes('UPDATE producto SET stock_prod = stock_prod - $1 WHERE id_prod = $2')) {
          // Mock para actualizar stock - simular que el stock se reduce
          const cantidad = params[0];
          const productId = params[1];
          if (mockStock[productId] !== undefined) {
            mockStock[productId] = Math.max(0, mockStock[productId] - cantidad);
          }
          return { rows: [{}] };
        }
        
        if (text.includes('BEGIN') || text.includes('COMMIT') || text.includes('ROLLBACK')) {
          // Mock para transacciones
          return { rows: [] };
        }
        
        // Default mock response
        return { rows: [] };
      },
      release: () => {}
    };
    return client;
  },
  
  query: async (text, params) => {
    const client = await mockPool.connect();
    const result = await client.query(text, params);
    client.release();
    return result;
  },
  
  end: async () => {
    // Mock end method
    return Promise.resolve();
  }
};

module.exports = mockPool;
