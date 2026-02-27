import { useRef, useState } from "react";
import MovieCard from "./MovieCard";

/**
 * MovieRow — Carrousel horizontal de films style Netflix
 *
 * Utilise group-hover pour révéler les flèches de navigation.
 * Scroll natif avec snap-x + scroll smooth.
 * Le titre de la catégorie se décale au hover de la section.
 */
export default function MovieRow({ title, movies = [] }) {
  const rowRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);

  const scroll = (direction) => {
    if (!rowRef.current) return;
    const scrollAmount = rowRef.current.clientWidth * 0.8;
    rowRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (rowRef.current) {
      setShowLeft(rowRef.current.scrollLeft > 0);
    }
  };

  if (!movies.length) return null;

  return (
    <section className="group/row relative mb-10 -mt-2">
      {/* Titre catégorie — se décale au hover */}
      <h2 className="text-lg md:text-xl font-bold mb-1 px-4 md:px-12 text-netflix-light group-hover/row:text-white transition-colors duration-300 cursor-pointer">
        {title}
        <span className="ml-2 text-sm text-primary opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
          Tout explorer &rsaquo;
        </span>
      </h2>

      <div className="relative">
        {/* Flèche gauche */}
        {showLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-20 w-12 bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 cursor-pointer"
            aria-label="Défiler à gauche"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Conteneur scrollable */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex gap-1.5 overflow-x-auto px-4 md:px-12 py-4 scroll-smooth snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Flèche droite */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-20 w-12 bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 cursor-pointer"
          aria-label="Défiler à droite"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
