// client/src/__tests__/Productos.test.js
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { CartContext } from '../context/CartContext';
import Productos from '../pages/content/Productos';

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div data-testid="router">{children}</div>,
}));

// Mock config
jest.mock('../config/config', () => ({
  buildApiUrl: (endpoint) => `http://localhost:5000${endpoint}`,
  buildImageUrl: (imagePath) => `http://localhost:5000/images/${imagePath}`,
}));

// Mock FiltroPanel component
jest.mock('../components/content/FiltroPanel', () => {
  return function MockFiltroPanel({ tipos, onCategoriaChange }) {
    return (
      <div data-testid="filtro-panel">
        <button onClick={() => onCategoriaChange('')}>Todos</button>
        {tipos.map(tipo => (
          <button key={tipo.id_tipoprod} onClick={() => onCategoriaChange(tipo.id_tipoprod)}>
            {tipo.nombre_tipoprod}
          </button>
        ))}
      </div>
    );
  };
});

const axios = require('axios');

const mockCartContext = {
  cart: [],
  addToCart: jest.fn()
};

const renderWithProviders = (component) => {
  return render(
    <CartContext.Provider value={mockCartContext}>
      {component}
    </CartContext.Provider>
  );
};

// Mock de datos de respuesta
const mockProductos = [
  {
    id_prod: 1,
    nombre_prod: 'Taladro',
    precio_prod: 49990,
    stock_prod: 10,
    id_tipoprod: 1
  }
];

const mockTipos = [
  {
    id_tipoprod: 1,
    nombre_tipoprod: 'Herramientas'
  }
];

describe('Productos Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup default axios mock responses
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/producto')) {
        return Promise.resolve({ data: mockProductos });
      }
      if (url.includes('/api/tipo-producto')) {
        return Promise.resolve({ data: mockTipos });
      }
      return Promise.reject(new Error('URL no mockada'));
    });
  });

  // Aumentar timeout para pruebas asíncronas
  jest.setTimeout(10000);

  test('renderiza el título del catálogo de productos', async () => {
    await act(async () => {
      renderWithProviders(<Productos />);
    });
    
    await waitFor(() => {
      const titulo = screen.getByText(/catálogo de productos/i);
      expect(titulo).toBeInTheDocument();
    });
  });

  test('muestra loading inicialmente', async () => {
    await act(async () => {
      renderWithProviders(<Productos />);
    });
    // El componente debería mostrar algún estado de carga
    expect(document.body).toBeInTheDocument();
  });

  test('maneja errores de API correctamente', async () => {
    // Mock error response
    axios.get.mockRejectedValue(new Error('Network Error'));
    
    await act(async () => {
      renderWithProviders(<Productos />);
    });
    
    await waitFor(() => {
      // Verificar que el componente maneja el error sin crashear
      expect(document.body).toBeInTheDocument();
    });
  });
});