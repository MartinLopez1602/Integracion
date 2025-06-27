import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { buildApiUrl, buildImageUrl } from '../../config/config';
import '../css/ProductForm.css';

function ProductForm({ product, tipos, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre_prod: '',
    precio_prod: '',
    stock_prod: '',
    id_tipoprod: '',
    imagen_url: '',
    destacado_prod: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (product) {
      setFormData({
        nombre_prod: product.nombre_prod || '',
        precio_prod: product.precio_prod || '',
        stock_prod: product.stock_prod || '',
        id_tipoprod: product.id_tipoprod || '',
        imagen_url: product.imagen_url || '',
        destacado_prod: product.destacado_prod || false
      });
      
      // Si hay una imagen existente, mostrarla como preview
      if (product.imagen_url) {
        setImagePreview(buildImageUrl(product.imagen_url.split('/').pop()));
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo debe ser menor a 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');

      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;

    const formDataUpload = new FormData();
    formDataUpload.append('image', selectedFile);

    try {
      const response = await axios.post(buildApiUrl('/api/upload/image'), formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      console.log('Respuesta del upload:', response.data);
      return response.data.imagePath;
    } catch (err) {
      console.error('Error al subir imagen:', err);
      throw new Error(err.response?.data?.error || 'Error al subir la imagen');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Validaciones
      if (!formData.nombre_prod.trim()) {
        throw new Error('El nombre del producto es obligatorio');
      }
      if (!formData.precio_prod || formData.precio_prod <= 0) {
        throw new Error('El precio debe ser mayor a 0');
      }
      if (!formData.stock_prod || formData.stock_prod < 0) {
        throw new Error('El stock no puede ser negativo');
      }
      if (!formData.id_tipoprod) {
        throw new Error('Debe seleccionar una categoría');
      }

      let imagePath = formData.imagen_url;

      // Si hay una nueva imagen seleccionada, subirla
      if (selectedFile) {
        console.log('Subiendo nueva imagen...');
        imagePath = await uploadImage();
        console.log('Imagen subida con path:', imagePath);
      }

      const dataToSend = {
        ...formData,
        precio_prod: parseFloat(formData.precio_prod),
        stock_prod: parseInt(formData.stock_prod),
        id_tipoprod: parseInt(formData.id_tipoprod),
        imagen_url: imagePath
      };

      console.log('Datos a enviar:', dataToSend);

      if (product) {
        // Actualizar producto existente
        await axios.put(buildApiUrl(`/api/producto/${product.id_prod}`), dataToSend);
      } else {
        // Crear nuevo producto
        const response = await axios.post(buildApiUrl('/api/producto'), dataToSend);
        console.log('Producto creado:', response.data);
      }

      onSuccess();
    } catch (err) {
      console.error('Error al guardar producto:', err);
      setError(err.response?.data?.error || err.message || 'Error al guardar el producto');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imagen_url: '' }));
    // Limpiar el input file
    const fileInput = document.getElementById('imagen');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? 'Editar Producto' : 'Agregar Producto'}</h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="nombre_prod">Nombre del Producto *</label>
            <input
              type="text"
              id="nombre_prod"
              name="nombre_prod"
              value={formData.nombre_prod}
              onChange={handleChange}
              required
              placeholder="Ingrese el nombre del producto"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="precio_prod">Precio *</label>
              <input
                type="number"
                id="precio_prod"
                name="precio_prod"
                value={formData.precio_prod}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock_prod">Stock *</label>
              <input
                type="number"
                id="stock_prod"
                name="stock_prod"
                value={formData.stock_prod}
                onChange={handleChange}
                min="0"
                required
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="id_tipoprod">Categoría *</label>
            <select
              id="id_tipoprod"
              name="id_tipoprod"
              value={formData.id_tipoprod}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una categoría</option>
              {tipos.map(tipo => (
                <option key={tipo.id_tipoprod} value={tipo.id_tipoprod}>
                  {tipo.nombre_tipoprod}
                </option>
              ))}
            </select>
          </div>

          {/* Sección de imagen */}
          <div className="form-group">
            <label htmlFor="imagen">Imagen del Producto</label>
            <div className="image-upload-container">
              <input
                type="file"
                id="imagen"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="imagen" className="file-input-label">
                <span className="file-input-icon">📁</span>
                Seleccionar imagen
              </label>
              
              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="btn btn-sm btn-danger clear-image-btn"
                  >
                    ×
                  </button>
                </div>
              )}

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{uploadProgress}%</span>
                </div>
              )}

              <div className="file-help-text">
                Formatos admitidos: JPEG, PNG, GIF, WebP (máx. 5MB)
              </div>
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="destacado_prod"
                checked={formData.destacado_prod}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Producto Destacado
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Guardando...' : (product ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;