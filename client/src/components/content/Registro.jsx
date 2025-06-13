import React, { useState } from 'react';
import axios from 'axios';
import '../css/Login.css';

export default function Register({ isOpen, onClose, onSwitch = () => {} }) {
    const [form, setForm] = useState({
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      password2: '',
    });
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState(null);
    const [closing, setClosing] = useState(false);
  
    if (!isOpen && !closing) return null;
  
    /* ── handlers ── */
    const handleChange = (e) =>
      setForm({ ...form, [e.target.name]: e.target.value });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (form.password !== form.password2) {
        setError('Las contraseñas no coinciden');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        await axios.post('http://localhost:5000/api/auth/register', {
          correo:   form.email,
          password: form.password,
          nombre:   form.nombre,
          apellido: form.apellido,
        });
        alert('Registro exitoso, inicia sesión.');
        handleClose();
        onSwitch();                       // abre login
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || 'Error al registrar');
      } finally {
        setLoading(false);
      }
    };
  
    const handleClose = () => {
      setClosing(true);
      setTimeout(() => {
        setClosing(false);
        onClose();
      }, 300);
    };
  
    /* ── JSX ── */
    return (
      <div
        className={`login-overlay ${closing ? 'closing' : ''}`}
        onClick={handleClose}
      >
        <div
          className={`login-card ${closing ? 'closing' : 'modal-animation'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <h1 className="login-title">Registro</h1>
          {error && <div className="error-message">{error}</div>}
  
          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={form.apellido}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              type="password"
              name="password2"
              placeholder="Repite contraseña"
              value={form.password2}
              onChange={handleChange}
              required
              className="input"
            />
            <button type="submit" className="btn btn-login" disabled={loading}>
              {loading ? 'Registrando…' : 'Registrarse'}
            </button>
          </form>
  
          <p className="login-footer">
            ¿Ya tienes cuenta?{' '}
            <span
              className="login-link"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                handleClose();
                onSwitch();              // vuelve al login
              }}
            >
              Inicia sesión
            </span>
          </p>
        </div>
      </div>
    );
  }
