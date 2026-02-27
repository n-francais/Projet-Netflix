import MovieCard from "./MovieCard";

/**
 * MovieList — Affiche la liste filtrée de films (TP04)
 *
 * Props (destructuring) :
 *  - movies : Movie[] → la liste filtrée (filteredMovies), PAS allMovies
 *  - title  : string  → titre optionnel de la section
 *
 * IMPORTANT : ce composant reçoit et affiche UNIQUEMENT filteredMovies,
 * c'est-à-dire le résultat du filtrage effectué par MovieFilter.
 * Il ne doit JAMAIS recevoir la liste complète directement.
 *
 * Le parent (Home) orchestre les données :
 *   allMovies → MovieFilter → onFilter(filtered) → setFilteredMovies
 *   filteredMovies → MovieList (affichage)
 */
const MovieList = ({ movies = [], title = "Films disponibles" }) => {
  // Aucun film à afficher
  if (movies.length === 0) {
    return (
      <div className="px-4 md:px-12 py-16 text-center">
        <p className="text-2xl font-bold mb-2 text-white">Aucun résultat</p>
        <p className="text-netflix-text">
          Aucun film ne correspond à cette catégorie.
        </p>
      </div>
    );
  }

  return (
    <section className="px-4 md:px-12 pb-8">
      {/* Titre */}
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-white">{title}</h2>

      {/* Grille responsive de MovieCard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
};

export default MovieList;
