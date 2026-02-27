import { useState, useEffect, useRef } from "react";
import { useCart } from "../../context/CartContext";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar({ searchQuery = "", onSearchChange }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const { cart, cartCount, handleRemoveFromCart, clearCart } = useCart();
  const searchRef = useRef(null);
  const cartRef = useRef(null);

  // ─── Scroll listener (useEffect propre) ────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ─── Ferme les menus au clic extérieur ─────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ─── Focus auto quand la barre de recherche s'ouvre ─────
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      const input = searchRef.current.querySelector("input");
      input?.focus();
    }
  }, [searchOpen]);

  // ─── Vérifier l'authentification ──────────────────
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("rentals");
    setUser(null);
    clearCart();
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-4 md:px-12 py-3 flex items-center justify-between ${
        scrolled
          ? "bg-netflix-black shadow-lg"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      {/* ── Logo + Liens ────────────────────────── */}
      <div className="flex items-center gap-8">
        <h1 className="text-primary text-3xl font-bold tracking-wider cursor-pointer">
          NETFLIX
        </h1>
        <ul className="hidden md:flex items-center gap-5 text-sm">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-bold"
                  : "text-gray-300 hover:text-white transition-colors duration-300"
              }
            >
              Accueil
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/my-rentals"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-bold"
                  : "text-gray-300 hover:text-white transition-colors duration-300"
              }
            >
              Mes locations
            </NavLink>
          </li>
        </ul>
      </div>

      {/* ── Actions droite ──────────────────────── */}
      <div className="flex items-center gap-4">
        {/* ── Barre de recherche ── */}
        <div ref={searchRef} className="relative flex items-center">
          <button
            onClick={() => setSearchOpen((prev) => !prev)}
            className="text-netflix-light hover:text-white transition-colors z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <div
            className={`absolute right-0 top-1/2 -translate-y-1/2 flex items-center transition-all duration-300 overflow-hidden ${
              searchOpen
                ? "w-64 opacity-100 border border-white/30 bg-black/90"
                : "w-0 opacity-0"
            }`}
          >
            <input
              type="text"
              value={onSearchChange ? searchQuery : localQuery}
              onChange={(e) => {
                const value = e.target.value;
                if (onSearchChange) {
                  onSearchChange(value);
                } else {
                  setLocalQuery(value);
                  navigate(`/search?q=${encodeURIComponent(value)}`);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !onSearchChange) {
                  navigate(`/search?q=${encodeURIComponent(localQuery)}`);
                }
              }}
              placeholder="Titres, genres, réalisateurs..."
              className="w-full bg-transparent text-white text-sm px-8 py-1.5 outline-none placeholder-netflix-text"
            />
            {(onSearchChange ? searchQuery : localQuery) && (
              <button
                onClick={() => {
                  if (onSearchChange) {
                    onSearchChange("");
                  } else {
                    setLocalQuery("");
                    navigate("/search");
                  }
                }}
                className="absolute right-2 text-netflix-text hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* ── Bouton panier ── */}
        <div ref={cartRef} className="relative">
          <button
            onClick={() => setCartOpen((prev) => !prev)}
            className="text-netflix-light hover:text-white transition-colors relative"
          >
            {/* Icône panier SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
            {/* Badge compteur temps réel */}
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-scale-in">
                {cartCount}
              </span>
            )}
          </button>

          {/* ── Dropdown panier ── */}
          {cartOpen && (
            <div className="absolute right-0 top-full mt-3 w-80 bg-netflix-dark/95 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl overflow-hidden animate-fade-in">
              {/* Header dropdown */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <h3 className="font-bold text-sm">Films loués ({cartCount})</h3>
                {cartCount > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-netflix-text hover:text-primary transition-colors"
                  >
                    Tout vider
                  </button>
                )}
              </div>

              {/* Liste des films */}
              <div className="max-h-80 overflow-y-auto">
                {cartCount === 0 ? (
                  <div className="px-4 py-8 text-center text-netflix-text text-sm">
                    <p className="mb-1">Votre panier est vide</p>
                    <p className="text-xs">
                      Cliquez sur "Louer" pour ajouter un film
                    </p>
                  </div>
                ) : (
                  cart.map(({ id, title, image, year, category, rating }) => (
                    <div
                      key={id}
                      onDoubleClick={() => handleRemoveFromCart(id)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors cursor-pointer group/item"
                      title="Double-cliquez pour supprimer"
                    >
                      <img
                        src={image}
                        alt={title}
                        className="w-12 h-16 object-cover rounded-sm flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {title}
                        </p>
                        <p className="text-xs text-netflix-text">
                          {year} • {category}
                        </p>
                        <p className="text-xs text-green-400">
                          {Math.round(rating * 10)}% Match
                        </p>
                      </div>
                      {/* Icône suppression au hover */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromCart(id);
                        }}
                        className="text-netflix-text hover:text-primary opacity-0 group-hover/item:opacity-100 transition-all flex-shrink-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer dropdown */}
              {cartCount > 0 && (
                <div className="px-4 py-3 border-t border-white/10 text-xs text-netflix-text text-center">
                  Double-cliquez sur un film pour le retirer
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Auth : Connexion / Déconnexion ── */}
        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-sm text-netflix-light">
              {user.name || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-1.5 rounded transition-colors"
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <NavLink
              to="/login"
              className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-1.5 rounded transition-colors"
            >
              Connexion
            </NavLink>
            <NavLink
              to="/register"
              className="hidden md:inline-block border border-white/30 hover:border-white text-white text-xs font-bold px-4 py-1.5 rounded transition-colors"
            >
              Inscription
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}
