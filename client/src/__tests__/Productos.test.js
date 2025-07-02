// client/src/__tests__/Productos.test.js
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import Productos from '../pages/content/Productos';

const mockCartContext = {
  cart: [],
  addToCart: jest.fn()
};

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <CartContext.Provider value={mockCartContext}>
        {component}
      </CartContext.Provider>
    </BrowserRouter>
  );
};

test('renderiza el título del catálogo de productos', () => {
  renderWithProviders(<Productos />);
  const titulo = screen.getByText(/catálogo de productos/i);
  expect(titulo).toBeInTheDocument();
});