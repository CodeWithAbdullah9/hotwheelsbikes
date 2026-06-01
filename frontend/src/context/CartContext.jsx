import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("hwb_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("hwb_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, selectedColor = null, selectedSize = null) => {
    setCartItems((prev) => {
      // Support both static (id) and API (_id) products
      const pid = product.id || product._id;
      const key = `${pid}-${selectedColor}-${selectedSize}`;
      const existing = prev.find(
        (item) =>
          (item.id || item._id) === pid &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );
      if (existing) {
        return prev.map((item) =>
          (item.id || item._id) === pid &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, selectedColor, selectedSize, cartKey: key }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartKey) => {
    setCartItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  const updateQuantity = (cartKey, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.cartKey === cartKey ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.salePrice * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
