import React, { useState } from 'react';
import axios from 'axios';
import '../css/Contacto.css';

function Contacto() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Llamada a la API con axios
      const response = await axios.post('http://localhost:5000/api/contacto', form);
      console.log('Respuesta del servidor:', response.data);
      setSuccess(true);
      setForm({ nombre: '', email: '', telefono: '', mensaje: '' });
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      setError('Error al enviar el mensaje. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contacto-container">
      <div className="contacto-box">
        <h2 className="contacto-title">Contáctanos</h2>
        <p className="contacto-desc">¿Tienes dudas o necesitas ayuda? Completa el formulario y nos comunicaremos contigo.</p>
        
        {success && (
          <div className="success-message">
            ¡Gracias por contactarnos! Te responderemos pronto.
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="contacto-form">
          <input
            type="text"
            name="nombre"
            placeholder="Tu nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Tu correo"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="telefono"
            placeholder="Tu teléfono (opcional)"
            value={form.telefono}
            onChange={handleChange}
          />
          <textarea
            name="mensaje"
            placeholder="Escribe tu mensaje..."
            rows="5"
            value={form.mensaje}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contacto;