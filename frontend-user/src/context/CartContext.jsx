import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

/**
 * CartContext — Gestion globale du panier de films loués
 *
 * Fournit :
 *  - cart : Film[]           → liste des films dans le panier
 *  - cartCount : number      → nombre de films (dérivé)
 *  - handleAddToCart(movie)   → ajoute un film (ignore les doublons)
 *  - handleRemoveFromCart(id) → supprime un film par son id
 *  - clearCart()              → vide le panier
 *  - isInCart(id)             → vérifie si un film est déjà loué
 *
 * Persistance : le panier est sauvegardé dans localStorage
 * et restauré au montage via useEffect.
 */

const CartContext = createContext(null);

// Clé localStorage
const STORAGE_KEY = "netflix-cart";

/**
 * Charge le panier depuis localStorage
 * @returns {Array} - tableau de films ou tableau vide
 */
const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  // ─── State ────────────────────────────────────────────
  const [cart, setCart] = useState(loadCartFromStorage);

  // ─── Persistance localStorage (useEffect) ─────────────
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // ─── Dérivation ───────────────────────────────────────
  const cartCount = cart.length;

  // ─── Handlers (arrow functions + useCallback) ─────────

  /** Ajoute un film au panier — ignore si déjà présent */
  const handleAddToCart = useCallback((movie) => {
    setCart((prev) => {
      // Vérifie les doublons avec find()
      const alreadyInCart = prev.find(({ id }) => id === movie.id);
      if (alreadyInCart) return prev;
      return [...prev, movie];
    });
  }, []);

  /** Supprime un film du panier par son id */
  const handleRemoveFromCart = useCallback((movieId) => {
    setCart((prev) => prev.filter(({ id }) => id !== movieId));
  }, []);

  /** Vide entièrement le panier */
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  /** Vérifie si un film est dans le panier */
  const isInCart = useCallback(
    (movieId) => cart.some(({ id }) => id === movieId),
    [cart],
  );

  // ─── Value objet destructurable par les consumers ─────
  const value = useMemo(
    () => ({
      cart,
      cartCount,
      handleAddToCart,
      handleRemoveFromCart,
      clearCart,
      isInCart,
    }),
    [
      cart,
      cartCount,
      handleAddToCart,
      handleRemoveFromCart,
      clearCart,
      isInCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/**
 * Hook custom pour accéder au panier
 * Usage : const { cart, handleAddToCart } = useCart();
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé dans un <CartProvider>");
  }
  return context;
};

export default CartContext;
