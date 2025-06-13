import React, { useState } from 'react';
import axios from 'axios';
import '../css/Login.css';

export default function Login({ isOpen, onClose, onSwitch = () => {} }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [closing, setClosing] = useState(false);

  if (!isOpen && !closing) return null;

  /* ───── handlers ───── */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', {
        correo: form.email,
        password: form.password,
      });
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      window.location.reload();
    } catch (err) {
      console.error('Login error:', err);
      setError('Credenciales inválidas. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 300); // duración de animación de salida
  };

  /* ───── markup ───── */
  return (
    <div
      className={`login-overlay ${closing ? 'closing' : ''}`}
      onClick={handleClose}
    >
      <div
        className={`login-card ${closing ? 'closing' : 'modal-animation'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="login-title">Login</h1>

        <div className="social-buttons">
          <button className="btn btn-facebook" type="button">
            Login with Facebook
          </button>
          <button className="btn btn-twitter" type="button">
            Login with Twitter
          </button>
        </div>

        <div className="login-divider">Login with email</div>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
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
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="input"
          />
          <button type="submit" className="btn btn-login" disabled={loading}>
            {loading ? 'Enviando…' : 'Login'}
          </button>
        </form>

        <p className="login-footer">
          ¿No tienes cuenta?{' '}
          <span
            className="login-link"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              handleClose();
              onSwitch();            // abre el modal de registro
            }}
          >
            Regístrate ahora
          </span>
        </p>
      </div>
    </div>
  );
}
