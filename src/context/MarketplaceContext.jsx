import { createContext, useContext, useState } from "react";

const MarketplaceContext = createContext(null);

export function MarketplaceProvider({ children }) {
  const [savedProducts, setSavedProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [checkoutDetails, setCheckoutDetails] = useState(null);
  const [order, setOrder] = useState(null);

  const toggleSaved = (product) =>
    setSavedProducts((items) =>
      items.some((item) => item.id === product.id)
        ? items.filter((item) => item.id !== product.id)
        : [...items, product],
    );

  const isSaved = (id) => savedProducts.some((item) => item.id === id);

  const addToCart = (product) => {
    if (product.type !== "product" || product.stock <= 0) {
      return;
    }

    setCartItems((items) => {
      const matchingItem = items.find((item) => item.id === product.id);

      if (matchingItem) {
        return items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...items, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id, quantity) => {
    if (quantity < 1) {
      setCartItems((items) => items.filter((item) => item.id !== id));
      return;
    }

    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      ),
    );
  };

  const removeFromCart = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const cartSubtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const shipping = cartItems.length ? 15000 : 0;
  const cartTotal = cartSubtotal + shipping;

  const placeOrder = (paymentMethod) => {
    if (!cartItems.length) {
      return null;
    }

    const newOrder = {
      id: `MB-${Date.now().toString().slice(-6)}`,
      items: cartItems,
      subtotal: cartSubtotal,
      shipping,
      total: cartTotal,
      customer: checkoutDetails,
      paymentMethod,
      status: "PAID",
    };

    setOrder(newOrder);
    setCartItems([]);

    return newOrder;
  };

  return (
    <MarketplaceContext.Provider
      value={{
        savedProducts,
        toggleSaved,
        isSaved,
        cartItems,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        cartSubtotal,
        shipping,
        cartTotal,
        checkoutDetails,
        setCheckoutDetails,
        order,
        placeOrder,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export const useMarketplace = () => useContext(MarketplaceContext);
