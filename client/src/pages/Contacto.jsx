import React, { useState } from 'react';

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
    alert('Mensaje enviado. Gracias por contactarnos.');
    setForm({ nombre: '', correo: '', mensaje: '' });
  };

  return (
    <section style={{ padding: '40px' }}>
      <h2>Contacto</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px' }}>
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
        <button type="submit" style={{ backgroundColor: '#222', color: '#fff', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>
          Enviar
        </button>
      </form>
    </section>
  );
}

export default Contacto;
