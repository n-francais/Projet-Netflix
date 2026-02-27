/**
 * MovieCard — Carte de film style Netflix
 *
 * Effets au hover (group-hover Tailwind 4.1) :
 *  - Scale up de la carte
 *  - Overlay sombre avec infos (titre, année, note, catégorie)
 *  - Boutons d'action apparaissent
 *
 * Props : movie { id, title, description, year, category, rating, image, duration }
 */
export default function MovieCard({ movie }) {
  return (
    <div className="group relative min-w-[180px] md:min-w-[220px] cursor-pointer snap-start">
      {/* Image de la carte */}
      <div className="relative overflow-hidden rounded-sm transition-all duration-300 group-hover:scale-110 group-hover:z-30 group-hover:shadow-2xl group-hover:rounded-md">
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
            <button className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-netflix-light transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
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
