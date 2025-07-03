import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { buildApiUrl, buildImageUrl } from '../../config/config';
import ProductForm from '../../components/content/ProductForm';
import '../css/GestionProductos.css';

function GestionProductos() {
  const [productos, setProductos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [success, setSuccess] = useState('');
  
  // Estados para filtros y ordenamiento expandidos
  const [filtroStock, setFiltroStock] = useState('todos');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroDestacado, setFiltroDestacado] = useState('todos');
  const [ordenamiento, setOrdenamiento] = useState('nombre');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productosRes, tiposRes] = await Promise.all([
        axios.get(buildApiUrl('/api/producto')),
        axios.get(buildApiUrl('/api/tipo-producto'))
      ]);
      setProductos(productosRes.data);
      setTipos(tiposRes.data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar los datos. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Función para filtrar productos expandida
  const productosFiltrados = productos.filter(producto => {
    // Filtro por búsqueda
    const coincideBusqueda = !busqueda || 
      producto.nombre_prod.toLowerCase().includes(busqueda.toLowerCase()) ||
      (producto.tipo_producto && producto.tipo_producto.toLowerCase().includes(busqueda.toLowerCase()));

    if (!coincideBusqueda) return false;

    // Filtro por stock
    let cumpleStock = true;
    switch (filtroStock) {
      case 'agotado':
        cumpleStock = producto.stock_prod === 0;
        break;
      case 'bajo':
        cumpleStock = producto.stock_prod > 0 && producto.stock_prod <= 10;
        break;
      case 'disponible':
        cumpleStock = producto.stock_prod > 10;
        break;
      case 'todos':
      default:
        cumpleStock = true;
        break;
    }

    // Filtro por categoría
    let cumpleCategoria = true;
    if (filtroCategoria !== 'todos') {
      cumpleCategoria = producto.tipo_producto === filtroCategoria;
    }

    // Filtro por destacado
    let cumpleDestacado = true;
    switch (filtroDestacado) {
      case 'destacados':
        cumpleDestacado = producto.destacado_prod === true;
        break;
      case 'no-destacados':
        cumpleDestacado = producto.destacado_prod === false;
        break;
      case 'todos':
      default:
        cumpleDestacado = true;
        break;
    }

    return cumpleStock && cumpleCategoria && cumpleDestacado;
  });

  // Función para ordenar productos
  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    switch (ordenamiento) {
      case 'stock-asc':
        return a.stock_prod - b.stock_prod;
      case 'stock-desc':
        return b.stock_prod - a.stock_prod;
      case 'precio-asc':
        return a.precio_prod - b.precio_prod;
      case 'precio-desc':
        return b.precio_prod - a.precio_prod;
      case 'categoria':
        return (a.tipo_producto || '').localeCompare(b.tipo_producto || '');
      case 'destacado':
        return (b.destacado_prod ? 1 : 0) - (a.destacado_prod ? 1 : 0);
      case 'nombre':
      default:
        return a.nombre_prod.localeCompare(b.nombre_prod);
    }
  });

  // Función para toggle destacado
  const handleToggleDestacado = async (producto) => {
    try {
      const nuevoEstado = !producto.destacado_prod;
      await axios.put(buildApiUrl(`/api/producto/${producto.id_prod}`), {
        ...producto,
        destacado_prod: nuevoEstado
      });

      // Actualizar el estado local
      setProductos(prevProductos => 
        prevProductos.map(p => 
          p.id_prod === producto.id_prod 
            ? { ...p, destacado_prod: nuevoEstado }
            : p
        )
      );

      setSuccess(`Producto ${nuevoEstado ? 'marcado como destacado' : 'desmarcado como destacado'}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error al actualizar producto destacado:', err);
      setError('Error al actualizar el producto');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      await axios.delete(buildApiUrl(`/api/producto/${productId}`));
      setProductos(productos.filter(p => p.id_prod !== productId));
      setSuccess('Producto eliminado exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      setError('Error al eliminar el producto');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = () => {
    fetchData();
    handleFormClose();
    setSuccess(editingProduct ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
    setTimeout(() => setSuccess(''), 3000);
  };

  const getStockBadgeClass = (stock) => {
    if (stock === 0) return 'badge-danger';
    if (stock <= 10) return 'badge-warning';
    return 'badge-success';
  };

  const getStockText = (stock) => {
    if (stock === 0) return 'Agotado';
    if (stock <= 10) return 'Stock Bajo';
    return 'Disponible';
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltroStock('todos');
    setFiltroCategoria('todos');
    setFiltroDestacado('todos');
    setBusqueda('');
    setOrdenamiento('nombre');
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="gestion-productos">
      <div className="gestion-header">
        <h1>Gestión de Productos</h1>
        <button 
          onClick={handleCreateProduct}
          className="btn btn-primary"
        >
          Agregar Producto
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Controles de filtrado y ordenamiento */}
      <div className="filtros-container">
        <div className="filtros-row">
          <div className="filtro-group">
            <label htmlFor="busqueda">Buscar:</label>
            <input
              type="text"
              id="busqueda"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o categoría..."
              className="filtro-input"
            />
          </div>

          <div className="filtro-group">
            <label htmlFor="filtro-categoria">Categoría:</label>
            <select
              id="filtro-categoria"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="filtro-select"
            >
              <option value="todos">Todas las categorías</option>
              {tipos.map(tipo => (
                <option key={tipo.id_tipoprod} value={tipo.nombre_tipoprod}>
                  {tipo.nombre_tipoprod}
                </option>
              ))}
            </select>
          </div>

          <div className="filtro-group">
            <label htmlFor="filtro-stock">Stock:</label>
            <select
              id="filtro-stock"
              value={filtroStock}
              onChange={(e) => setFiltroStock(e.target.value)}
              className="filtro-select"
            >
              <option value="todos">Todos</option>
              <option value="disponible">Disponible (&gt;10)</option>
              <option value="bajo">Stock Bajo (1-10)</option>
              <option value="agotado">Agotado (0)</option>
            </select>
          </div>

          <div className="filtro-group">
            <label htmlFor="filtro-destacado">Destacados:</label>
            <select
              id="filtro-destacado"
              value={filtroDestacado}
              onChange={(e) => setFiltroDestacado(e.target.value)}
              className="filtro-select"
            >
              <option value="todos">Todos</option>
              <option value="destacados">Solo Destacados</option>
              <option value="no-destacados">No Destacados</option>
            </select>
          </div>

          <div className="filtro-group">
            <label htmlFor="ordenamiento">Ordenar por:</label>
            <select
              id="ordenamiento"
              value={ordenamiento}
              onChange={(e) => setOrdenamiento(e.target.value)}
              className="filtro-select"
            >
              <option value="nombre">Nombre (A-Z)</option>
              <option value="categoria">Categoría</option>
              <option value="stock-asc">Stock (Menor a Mayor)</option>
              <option value="stock-desc">Stock (Mayor a Menor)</option>
              <option value="precio-asc">Precio (Menor a Mayor)</option>
              <option value="precio-desc">Precio (Mayor a Menor)</option>
              <option value="destacado">Destacados Primero</option>
            </select>
          </div>
        </div>

        <div className="filtros-actions">
          <div className="resultados-info">
            Mostrando {productosOrdenados.length} de {productos.length} productos
          </div>
          <button 
            onClick={limpiarFiltros}
            className="btn btn-secondary btn-sm"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      <div className="productos-table-container">
        <table className="productos-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>
                Stock
                <span className="stock-legend">
                  <span className="legend-item">
                    <span className="badge badge-success"></span> &gt;10
                  </span>
                  <span className="legend-item">
                    <span className="badge badge-warning"></span> 1-10
                  </span>
                  <span className="legend-item">
                    <span className="badge badge-danger"></span> 0
                  </span>
                </span>
              </th>
              <th>Categoría</th>
              <th>Destacado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosOrdenados.map(producto => (
              <tr key={producto.id_prod} className={producto.stock_prod === 0 ? 'producto-agotado' : ''}>
                <td>
                  <img 
                    src={buildImageUrl(producto.imagen_url?.split('/').pop() || 'Alargador.png')} 
                    alt={producto.nombre_prod}
                    className="product-thumbnail"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = buildImageUrl('Alargador.png');
                    }}
                  />
                </td>
                <td>
                  {producto.nombre_prod}
                  {producto.stock_prod === 0 && <span className="agotado-text">(Agotado)</span>}
                  {producto.destacado_prod && <span className="destacado-indicator">⭐</span>}
                </td>
                <td>${producto.precio_prod}</td>
                <td>
                  <div className="stock-cell">
                    <span className="stock-number">{producto.stock_prod}</span>
                    <span className={`badge ${getStockBadgeClass(producto.stock_prod)}`}>
                      {getStockText(producto.stock_prod)}
                    </span>
                  </div>
                </td>
                <td>{producto.tipo_producto || 'Sin categoría'}</td>
                <td>
                  <button
                    onClick={() => handleToggleDestacado(producto)}
                    className={`btn btn-sm toggle-destacado ${producto.destacado_prod ? 'btn-warning' : 'btn-outline'}`}
                    title={producto.destacado_prod ? 'Quitar de destacados' : 'Marcar como destacado'}
                  >
                    {producto.destacado_prod ? '⭐ Destacado' : '☆ Destacar'}
                  </button>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleEditProduct(producto)}
                      className="btn btn-sm btn-secondary"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(producto.id_prod)}
                      className="btn btn-sm btn-danger"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {productosOrdenados.length === 0 && (
          <div className="no-products">
            No se encontraron productos que coincidan con los filtros seleccionados.
          </div>
        )}
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          tipos={tipos}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

export default GestionProductos;