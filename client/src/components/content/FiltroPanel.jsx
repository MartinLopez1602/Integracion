import React, { useState } from 'react';
import '../css/FiltroPanel.css';

function FiltroPanel({ tipos, setCategoriaSeleccionada }) {
  const [categoriaSeleccionadaLocal, setCategoriaSeleccionadaLocal] = useState('');
  const [precio, setPrecio] = useState([0, 1500]);
  const [disponibleTienda, setDisponibleTienda] = useState(false);
  const [disponibleOnline, setDisponibleOnline] = useState(false);
  const [valoracion, setValoracion] = useState('');

  const handleCategoriaChange = (e) => {
    const value = e.target.value;
    setCategoriaSeleccionadaLocal(value);
    setCategoriaSeleccionada(value);
  };

  return (
    <div className="filtro-panel">
      <div className="filtro-seccion">
        <h3>Categorías</h3>
        <ul className="checkbox-list">
          {tipos.map((tipo) => (
            <li key={tipo.id_tipoprod}>
              <label htmlFor={`categoria-${tipo.id_tipoprod}`}>
                <input type="radio" id={`categoria-${tipo.id_tipoprod}`} name="categoria" value={tipo.nombre_tipoprod}
                  checked={categoriaSeleccionadaLocal === tipo.nombre_tipoprod} onChange={handleCategoriaChange} />
                {tipo.nombre_tipoprod}
              </label>
            </li>
          ))}
          <li>
            <label htmlFor="categoria-todas">
              <input type="radio" id="categoria-todas" name="categoria" value=""
                checked={categoriaSeleccionadaLocal === ''} onChange={handleCategoriaChange} />
              Todas
            </label>
          </li>
        </ul>
      </div>

      <div className="filtro-seccion">
        <h3>Precio</h3>
        <p>Rango: ${precio[0]} - ${precio[1]}</p>
        <input type="range" min="0" max="1500" value={precio[1]} onChange={(e) => setPrecio([0, parseInt(e.target.value)])} />
      </div>

      <div className="filtro-seccion">
        <h3>Disponibilidad</h3>
        <label htmlFor="disponible-tienda">
          <input id="disponible-tienda" type="checkbox" checked={disponibleTienda} onChange={() => setDisponibleTienda(!disponibleTienda)} />
          Disponible en tienda
        </label>
        <label htmlFor="disponible-online">
          <input id="disponible-online" type="checkbox" checked={disponibleOnline} onChange={() => setDisponibleOnline(!disponibleOnline)} />
          Disponible online
        </label>
      </div>

      <div className="filtro-seccion">
        <h3>Valoración</h3>
        <div className="valoracion">
          {['5', '4', '3'].map((val) => (
            <label key={val}>
              <input type="radio" name="valoracion" value={val} checked={valoracion === val} onChange={(e) => setValoracion(e.target.value)} />
              {'⭐'.repeat(val)}{val !== '5' && '+'}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FiltroPanel;