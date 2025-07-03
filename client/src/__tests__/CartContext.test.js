
// client/src/__tests__/CartContext.test.js
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, CartContext } from '../context/CartContext';
import { useContext } from 'react';

// Mock localStorage para controlar su comportamiento
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('CartContext', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    localStorageMock.clear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    
    // Configurar localStorage para que regrese carrito vacío
    localStorageMock.getItem.mockReturnValue(null);
  });

  test('agrega producto al carrito correctamente', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
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

  test('incrementa cantidad si producto ya existe en carrito', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useContext(CartContext), { wrapper });
    
    const producto = {
      id_prod: 1,
      nombre_prod: 'Taladro',
      precio_prod: 49990,
      stock_prod: 10
    };

    act(() => {
      result.current.addToCart(producto);
      result.current.addToCart(producto);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(2);
    expect(result.current.total).toBe(99980);
  });

  test('inicia con carrito vacío', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useContext(CartContext), { wrapper });
    
    expect(result.current.cart).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });

  test('puede limpiar el carrito', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
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

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.cart).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });
});