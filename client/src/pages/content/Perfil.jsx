import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { API_BASE_URL, buildApiUrl, buildImageUrl } from '../../config/config';
import '../css/Perfil.css';

function Perfil() {
  const { user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    apellido2: '',
    correo: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        apellido2: user.apellido2 || '',
        correo: user.correo || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('access');
      const response = await axios.put(
        buildApiUrl('/api/auth/profile'),
        {
          nombre: form.nombre,
          apellido: form.apellido,
          apellido2: form.apellido2
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUser({ ...user, ...response.data.user });
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Error al actualizar el perfil' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (form.newPassword !== form.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas nuevas no coinciden' });
      return;
    }

    if (form.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('access');
      await axios.put(
        buildApiUrl('/api/auth/password'),
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
      setForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setShowPasswordForm(false);
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Error al cambiar la contraseña' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="perfil-container">
        <div className="perfil-card">
          <h2>Acceso Denegado</h2>
          <p>Debes iniciar sesión para ver tu perfil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <div className="perfil-header">
          <h2>Mi Perfil</h2>
          <div className="user-role">
            <span className={`role-badge ${user.rol}`}>
              {user.rol === 'admin' ? 'Administrador' : 
               user.rol === 'empleado' ? 'Empleado' : 'Cliente'}
            </span>
          </div>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Información del perfil */}
        <form onSubmit={handleUpdateProfile} className="perfil-form">
          <h3>Información Personal</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Primer Apellido</label>
              <input
                type="text"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Segundo Apellido</label>
              <input
                type="text"
                name="apellido2"
                value={form.apellido2}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                value={form.correo}
                disabled
                className="disabled-input"
              />
              <small>El correo no se puede modificar</small>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Actualizar Perfil'}
          </button>
        </form>

        {/* Sección de cambio de contraseña */}
        <div className="password-section">
          <button 
            type="button"
            className="btn-secondary"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            {showPasswordForm ? 'Cancelar' : 'Cambiar Contraseña'}
          </button>

          {showPasswordForm && (
            <form onSubmit={handleChangePassword} className="password-form">
              <h3>Cambiar Contraseña</h3>
              
              <div className="form-group">
                <label>Contraseña Actual</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Nueva Contraseña</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Perfil;