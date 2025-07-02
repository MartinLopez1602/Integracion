
// client/src/__tests__/CartContext.test.js
import { renderHook, act } from '@testing-library/react';
import { CartProvider, CartContext } from '../context/CartContext';
import { useContext } from 'react';

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

test('agrega producto al carrito correctamente', () => {
  const { result } = renderHook(() => useContext(CartContext), { wrapper });
  
  const producto = {
    id_prod: 1,
    nombre_prod: 'Taladro',
    precio_prod: 49990,
    stock_prod: 10
  };

  act(() => {
    result.current.addToCart(producto);
  });

  expect(result.current.cart).toHaveLength(1);
  expect(result.current.cart[0].quantity).toBe(1);
  expect(result.current.total).toBe(49990);
});