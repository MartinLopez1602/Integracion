import React, { createContext, useState, useEffect } from 'react';

// 1. Crear el contexto
export const CartContext = createContext();

// 2. Crear el proveedor del contexto
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Recuperar carrito del localStorage al iniciar
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [total, setTotal] = useState(0);

  // Guardar en localStorage cada vez que el carrito cambie
  useEffect(() => {
    // Only save to localStorage without updating total state
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    
    // Calcular total
    const newTotal = cart.reduce((sum, item) => 
      sum + (item.precio_prod * item.quantity), 0);
    setTotal(newTotal);
  }, [cart]);

  // Agregar producto al carrito
  const addToCart = (product) => {
    setCart(prevCart => {
      // Verificar si el producto ya está en el carrito
      const existingItem = prevCart.find(item => item.id_prod === product.id_prod);
      
      if (existingItem) {
        // Incrementar cantidad si ya existe
        return prevCart.map(item => 
          item.id_prod === product.id_prod 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Agregar nuevo producto con cantidad 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id_prod !== productId));
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id_prod === productId ? { ...item, quantity } : item
      )
    );
  };

  // Vaciar carrito
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      total, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      itemCount: cart.reduce((count, item) => count + item.quantity, 0)
    }}>
      {children}
    </CartContext.Provider>
  );
};