import React, { useState } from 'react';
import './Contacto.css';

function Contacto() {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    mensaje: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario enviado:', form);
    alert('Gracias por contactarnos, te responderemos pronto.');
    setForm({ nombre: '', correo: '', mensaje: '' });
  };

  return (
    <section className="contacto-container">
      <div className="contacto-box">
        <h2 className="contacto-title">Contáctanos</h2>
        <p className="contacto-desc">¿Tienes dudas o necesitas ayuda? Completa el formulario y nos comunicaremos contigo.</p>
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
            name="correo"
            placeholder="Tu correo"
            value={form.correo}
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
          <button type="submit">Enviar mensaje</button>
        </form>
      </div>
    </section>
  );
}

export default Contacto;
