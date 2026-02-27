import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

/**
 * HeroBanner — Bannière héro plein écran style Netflix
 *
 * Affiche un film mis en avant avec :
 *  - Image de fond en bannière (banner URL)
 *  - Gradient overlay noir → transparent
 *  - Titre, description, boutons d'action
 *  - Animation fade-in / slide-up (keyframes @theme)
 *
 * Props : movie { title, description, banner, year, rating, category }
 */
export default function Hero({ movie }) {
  const navigate = useNavigate();

  // Film par défaut si aucun n'est passé
  const featured = movie || {
    id: 1,
    title: "Inception",
    description:
      "Un voleur qui s'infiltre dans les rêves des gens pour voler leurs secrets se voit offrir une chance de rédemption.",
    banner:
      "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    year: 2010,
    rating: 8.8,
    category: "Science-Fiction",
  };

  return (
    <section className="relative h-[85vh] w-full overflow-hidden">
      {/* Image de fond */}
      <div className="absolute inset-0">
        <img
          src={featured.banner}
          alt={featured.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay : noir en bas, transparent en haut */}
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/40 to-transparent" />
        {/* Gradient latéral gauche pour la lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black/80 via-transparent to-transparent" />
      </div>

      {/* Contenu texte */}
      <div className="relative z-10 flex flex-col justify-end h-full px-4 md:px-12 pb-32">
        <div className="max-w-xl animate-fade-in">
          {/* Badge catégorie */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-primary font-bold text-sm tracking-widest uppercase">
              N Film
            </span>
            <span className="text-netflix-text text-sm">
              {featured.category}
            </span>
          </div>

          {/* Titre */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 animate-slide-up">
            {featured.title}
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-netflix-light mb-6 line-clamp-3 leading-relaxed">
            {featured.description}
          </p>

          {/* Infos rapides */}
          <div className="flex items-center gap-3 mb-5 text-sm">
            <span className="text-green-400 font-bold">
              {Math.round(featured.rating * 10)}% Match
            </span>
            <span className="text-netflix-text">{featured.year}</span>
            <span className="border border-white/40 px-1.5 py-0.5 text-[11px] text-white/80">
              HD
            </span>
          </div>

          {/* Boutons */}
          <div className="flex items-center gap-3">
            <Button variant="white" size="lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              Lecture
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate(`/movie/${featured.id}`)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Plus d'infos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
