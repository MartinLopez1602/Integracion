import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Productos.css';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [formData, setFormData] = useState({
    nombre_prod: '',
    precio_prod: '',
    stock_prod: '',
    tipo_nombre: ''
  });

  useEffect(() => {
    obtenerProductos();
    obtenerTiposProducto();
  }, []);

  const obtenerProductos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/producto');
      setProductos(res.data);
    } catch (err) {
      console.error('Error al obtener productos:', err);
    }
  };

  const obtenerTiposProducto = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tipo-producto');
      setTipos(res.data);
    } catch (err) {
      console.error('Error al obtener tipos de producto:', err);
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const tipoSeleccionado = tipos.find(t => t.nombre_tipoprod === formData.tipo_nombre);

    if (!tipoSeleccionado) {
      alert('❌ Tipo de producto no válido');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/producto', {
        nombre_prod: formData.nombre_prod,
        precio_prod: formData.precio_prod,
        stock_prod: formData.stock_prod,
        id_tipoprod: tipoSeleccionado.id_tipoprod
      });
      alert('✅ Producto agregado');
      setFormData({ nombre_prod: '', precio_prod: '', stock_prod: '', tipo_nombre: '' });
      obtenerProductos();
    } catch (err) {
      console.error('❌ Error al agregar producto:', err);
    }
  };

  return (
    <div className="contenedor">
      <h1 className="titulo">Gestión de Productos</h1>

      <form className="formulario" onSubmit={handleSubmit}>
        <input type="text" name="nombre_prod" placeholder="Nombre" value={formData.nombre_prod} onChange={handleChange} required />
        <input type="number" name="precio_prod" placeholder="Precio" value={formData.precio_prod} onChange={handleChange} required />
        <input type="number" name="stock_prod" placeholder="Stock" value={formData.stock_prod} onChange={handleChange} required />

        <select name="tipo_nombre" value={formData.tipo_nombre} onChange={handleChange} required>
          <option value="">Seleccione un tipo</option>
          {tipos.map(tipo => (
            <option key={tipo.id_tipoprod} value={tipo.nombre_tipoprod}>{tipo.nombre_tipoprod}</option>
          ))}
        </select>

        <button type="submit">Agregar</button>
      </form>

      <div className="lista-productos">
        {productos.map(prod => (
          <div className="card" key={prod.id_prod}>
            <h2>{prod.nombre_prod}</h2>
            <p><strong>💰 Precio:</strong> ${prod.precio_prod}</p>
            <p><strong>📦 Stock:</strong> {prod.stock_prod}</p>
            <p><strong>🧩 Tipo:</strong> {prod.tipo_producto || 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productos;
