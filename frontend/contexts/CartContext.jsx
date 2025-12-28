"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("pujaCart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pujaCart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (puja) => {
    setCart((prevCart) => {
      // Check if puja already exists in cart
      const exists = prevCart.find((item) => item.slug === puja.slug);
      if (exists) {
        // If exists, return cart as is (or you could update quantity)
        return prevCart;
      }
      // Add new puja to cart
      return [...prevCart, { ...puja, quantity: 1 }];
    });
  };

  const removeFromCart = (slug) => {
    setCart((prevCart) => prevCart.filter((item) => item.slug !== slug));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price || 0), 0);
  };

  const getCartCount = () => {
    return cart.length;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

