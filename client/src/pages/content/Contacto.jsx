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
    <div className="contact-wrapper">
      <div className="contact-card">
        <h2 className="contact-title">Contáctanos</h2>
        <p className="contact-subtitle">Nos pondremos en contacto contigo lo antes posible</p>

        {success && <div className="success-message">¡Gracias por tu mensaje! Te responderemos pronto.</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-row">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
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
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>

        <p className="contact-footer">También puedes llamarnos al <strong>333-33-33</strong></p>
      </div>
    </div>
  );
}

export default Contacto;
