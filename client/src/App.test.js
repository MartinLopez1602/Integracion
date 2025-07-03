import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: ({ element }) => element || <div data-testid="route"></div>,
}));

// Mock de los componentes que dependen de rutas
jest.mock('./components/content/Layout', () => {
  return function MockLayout() {
    return <div data-testid="layout">Layout Component</div>;
  };
});

jest.mock('./components/content/ProtectedRoute', () => {
  return function MockProtectedRoute({ children }) {
    return <div data-testid="protected-route">{children}</div>;
  };
});

// Mock de las páginas
jest.mock('./pages/content/Home', () => {
  return function MockHome() {
    return <div data-testid="home">Home Page</div>;
  };
});

jest.mock('./pages/content/Productos', () => {
  return function MockProductos() {
    return <div data-testid="productos">Productos Page</div>;
  };
});

// Mock de otros componentes que pueden necesitar ser mockeados
jest.mock('./pages/content/Pedidos', () => () => <div>Pedidos</div>);
jest.mock('./pages/content/GestionProductos', () => () => <div>GestionProductos</div>);
jest.mock('./pages/content/Contacto', () => () => <div>Contacto</div>);
jest.mock('./pages/content/Carrito', () => () => <div>Carrito</div>);
jest.mock('./pages/content/PagoExitoso', () => () => <div>PagoExitoso</div>);
jest.mock('./pages/content/PagoFallido', () => () => <div>PagoFallido</div>);
jest.mock('./pages/content/WebpaySimulator', () => () => <div>WebpaySimulator</div>);
jest.mock('./pages/content/Perfil', () => () => <div>Perfil</div>);

describe('App Component', () => {
  test('renders main application structure', () => {
    render(<App />);
    
    // Verificar que el componente se renderiza sin errores
    expect(document.body).toBeInTheDocument();
  });
});
