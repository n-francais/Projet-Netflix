import { useCart } from "../../context/CartContext";

/**
 * MovieCard — Carte de film style Netflix (dynamique)
 *
 * Intégrations TP04 :
 *  - Bouton "Louer" : ajoute au panier via useCart (handleAddToCart)
 *  - Bouton "+" : bascule ajout/retrait du panier
 *  - Visuel : le bouton change selon isInCart (vert si loué)
 *
 * Props : movie { id, title, description, year, category, rating, image, duration }
 */
export default function MovieCard({ movie }) {
  const { handleAddToCart, handleRemoveFromCart, isInCart } = useCart();
  const inCart = isInCart(movie.id);

  /** Clic sur le bouton + / ✓ → toggle panier */
  const handleToggleCart = (e) => {
    e.stopPropagation();
    if (inCart) {
      handleRemoveFromCart(movie.id);
    } else {
      handleAddToCart(movie);
    }
  };

  /** Clic sur "Louer" → ajoute au panier */
  const handleRent = (e) => {
    e.stopPropagation();
    handleAddToCart(movie);
  };

  // Couleur du badge catégorie selon le genre
  const categoryColors = {
    "Science-Fiction": "bg-purple-600",
    Action: "bg-red-700",
    Thriller: "bg-amber-700",
    Drame: "bg-blue-700",
    Fantastique: "bg-emerald-700",
    Comédie: "bg-yellow-600",
    Horreur: "bg-rose-800",
    Animation: "bg-cyan-600",
  };

  const { category } = movie; // destructuring
  const badgeColor = categoryColors[category] || "bg-netflix-gray";

  return (
    <div className="group relative min-w-[180px] md:min-w-[220px] cursor-pointer snap-start">
      {/* Badge "Loué" si dans le panier */}
      {inCart && (
        <div className="absolute top-2 left-2 z-40 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
          Loué
        </div>
      )}

      {/* Badge note (étoile + rating) — toujours visible en haut à droite */}
      <div className="absolute top-2 right-2 z-40 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
        <svg
          className="w-3.5 h-3.5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        {movie.rating}
      </div>

      {/* Badge catégorie — toujours visible en bas à gauche */}
      <div
        className={`absolute bottom-2 left-2 z-40 ${badgeColor} text-white text-[10px] font-bold px-2.5 py-1 rounded`}
      >
        {category}
      </div>

      {/* Image de la carte */}
      <div className="relative overflow-hidden rounded-lg transition-all duration-300 group-hover:scale-105 group-hover:z-30 group-hover:shadow-2xl">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-[270px] md:h-[320px] object-cover"
          loading="lazy"
        />

        {/* Overlay au hover — apparaît en douceur */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          {/* Boutons d'action */}
          <div className="flex items-center gap-2 mb-2">
            {/* Bouton Louer */}
            <button
              onClick={handleRent}
              disabled={inCart}
              className={`px-3 py-1 rounded text-xs font-bold transition-all duration-200 ${
                inCart
                  ? "bg-green-600 text-white cursor-default"
                  : "bg-white text-black hover:bg-netflix-light"
              }`}
            >
              {inCart ? "✓ Loué" : "Louer"}
            </button>
            {/* Bouton +/✓ toggle panier */}
            <button
              onClick={handleToggleCart}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                inCart
                  ? "border-green-500 text-green-500 hover:border-green-400"
                  : "border-white/50 text-white hover:border-white"
              }`}
            >
              {inCart ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              )}
            </button>
            <button className="w-8 h-8 rounded-full border-2 border-white/50 text-white flex items-center justify-center hover:border-white transition-colors">
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
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
            </button>
            {/* Bouton infos — poussé à droite */}
            <button className="ml-auto w-8 h-8 rounded-full border-2 border-white/50 text-white flex items-center justify-center hover:border-white transition-colors">
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* Infos texte */}
          <h3 className="text-white font-bold text-sm leading-tight">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs">
            <span className="text-green-400 font-semibold">
              {Math.round(movie.rating * 10)}% Match
            </span>
            <span className="border border-white/40 px-1 text-white/70 text-[10px]">
              HD
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-netflix-text">
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.duration} min</span>
          </div>
          <div className="mt-1">
            <span className="text-[10px] px-1.5 py-0.5 border border-white/20 rounded text-netflix-text">
              {movie.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
