import Navbar from "./components/layout/Navbar";
import Hero from "./components/layout/Hero";
import MovieRow from "./components/movies/MovieRow";
import moviesData from "../../data/movies.json";

/**
 * App — Page d'accueil Netflix Clone
 *
 * Structure :
 *  1. Navbar fixe transparente
 *  2. HeroBanner avec film vedette
 *  3. Carrousels par catégories (générés dynamiquement depuis movies.json)
 */
function App() {
  // Film vedette = premier film ou celui avec la meilleur note
  const featuredMovie = moviesData.reduce((best, movie) =>
    movie.rating > best.rating ? movie : best,
  );

  // Regrouper les films par catégorie
  const categories = moviesData.reduce((acc, movie) => {
    if (!acc[movie.category]) acc[movie.category] = [];
    acc[movie.category].push(movie);
    return acc;
  }, {});

  return (
    <div className="bg-netflix-black min-h-screen text-white font-sans">
      <Navbar />
      <Hero movie={featuredMovie} />

      {/* Carrousels de films par catégorie */}
      <div className="-mt-32 relative z-10">
        {/* Premier carrousel : tous les films (Tendances) */}
        <MovieRow title="Tendances actuelles" movies={moviesData} />

        {/* Carrousels par catégorie */}
        {Object.entries(categories).map(([category, movies]) => (
          <MovieRow key={category} title={category} movies={movies} />
        ))}

        {/* Carrousel top rated */}
        <MovieRow
          title="Les mieux notés"
          movies={[...moviesData].sort((a, b) => b.rating - a.rating)}
        />
      </div>

      {/* Footer minimal */}
      <footer className="px-4 md:px-12 py-12 text-netflix-text text-xs">
        <div className="max-w-5xl mx-auto">
          <p className="mb-4">Des questions ? Appelez le 0800-Netflix</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <a href="#" className="hover:underline">
              FAQ
            </a>
            <a href="#" className="hover:underline">
              Centre d'aide
            </a>
            <a href="#" className="hover:underline">
              Conditions d'utilisation
            </a>
            <a href="#" className="hover:underline">
              Confidentialité
            </a>
            <a href="#" className="hover:underline">
              Préférences de cookies
            </a>
            <a href="#" className="hover:underline">
              Informations légales
            </a>
          </div>
          <p className="text-netflix-text/50">
            &copy; 2026 Netflix Clone — Projet R4.10
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
