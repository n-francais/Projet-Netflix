import { useState, useEffect, useMemo } from "react";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/layout/Hero";
import MovieRow from "./components/movies/MovieRow";
import Home from "./pages/Home";
import useSearch from "./hooks/useSearch";
import rawMovies from "../../data/movies.json";

/**
 * App — Page d'accueil Netflix Clone (TP04 — dynamique)
 *
 * Hooks utilisés :
 *  - useState  : movies (données chargées), loading, showCatalogue (toggle vue)
 *  - useEffect : simule le chargement async depuis movies.json + log
 *  - useMemo   : categories dérivées (regroupement par catégorie)
 *  - useSearch : hook custom — query, filteredMovies, isSearching
 *
 * Intègre le composant Home (TP04) : filtrage MovieFilter → MovieList
 * Le CartProvider est wrappé dans main.jsx.
 */
function App() {
  // ─── State : simulation de chargement async ────────────
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCatalogue, setShowCatalogue] = useState(false);

  // ─── useEffect : "charge" les données au montage ───────
  useEffect(() => {
    // Simule un fetch réseau avec un petit délai
    const timer = setTimeout(() => {
      setMovies(rawMovies);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  // ─── useEffect : log pour debug ────────────────────────
  useEffect(() => {
    if (!loading) {
      console.log(`📦 ${movies.length} films chargés`);
    }
  }, [movies, loading]);

  // ─── Hook de recherche ─────────────────────────────────
  const { query, setQuery, filteredMovies, isSearching } = useSearch(movies);

  // ─── Film vedette = meilleure note (useMemo) ───────────
  const featuredMovie = useMemo(
    () =>
      movies.length
        ? movies.reduce((best, movie) =>
            movie.rating > best.rating ? movie : best,
          )
        : null,
    [movies],
  );

  // ─── Catégories regroupées (useMemo) ───────────────────
  const categories = useMemo(
    () =>
      filteredMovies.reduce((acc, movie) => {
        const { category } = movie; // destructuring
        if (!acc[category]) acc[category] = [];
        acc[category].push(movie);
        return acc;
      }, {}),
    [filteredMovies],
  );

  // ─── Écran de chargement ───────────────────────────────
  if (loading) {
    return (
      <div className="bg-netflix-black min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <h1 className="text-primary text-5xl font-bold mb-4">NETFLIX</h1>
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-netflix-black min-h-screen text-white font-sans">
      <Navbar searchQuery={query} onSearchChange={setQuery} />
      <Hero movie={featuredMovie} />

      {/* ── Zone de résultats ── */}
      <div className="-mt-32 relative z-10">
        {/* Indicateur de recherche active */}
        {isSearching && (
          <div className="px-4 md:px-12 pt-4 pb-2">
            <p className="text-netflix-text text-sm">
              {filteredMovies.length} résultat
              {filteredMovies.length !== 1 ? "s" : ""} pour{" "}
              <span className="text-white font-semibold">"{query}"</span>
            </p>
          </div>
        )}

        {/* Résultats de recherche en grille */}
        {isSearching ? (
          filteredMovies.length > 0 ? (
            <MovieRow title="Résultats de recherche" movies={filteredMovies} />
          ) : (
            <div className="px-4 md:px-12 py-20 text-center">
              <p className="text-2xl font-bold mb-2">Aucun résultat</p>
              <p className="text-netflix-text">
                Essayez avec d'autres mots-clés (titre, genre, réalisateur)
              </p>
            </div>
          )
        ) : (
          <>
            {/* Carrousel tendances (tous les films) */}
            <MovieRow title="Tendances actuelles" movies={movies} />

            {/* Carrousels par catégorie */}
            {Object.entries(categories).map(([category, categoryMovies]) => (
              <MovieRow
                key={category}
                title={category}
                movies={categoryMovies}
              />
            ))}

            {/* Carrousel top rated */}
            <MovieRow
              title="Les mieux notés"
              movies={[...movies].sort((a, b) => b.rating - a.rating)}
            />
          </>
        )}

        {/* ── Bouton toggle Catalogue (TP04 : Home + MovieFilter + MovieList) ── */}
        <div className="px-4 md:px-12 py-8">
          <button
            onClick={() => setShowCatalogue((prev) => !prev)}
            className="px-6 py-2 bg-primary hover:bg-primary-hover text-white font-semibold
                       rounded transition-colors duration-200 cursor-pointer"
          >
            {showCatalogue
              ? "Masquer le catalogue"
              : "📋 Voir le catalogue filtrable"}
          </button>
        </div>

        {/* ── Composant Home (TP04) : MovieFilter → filteredMovies → MovieList ── */}
        {showCatalogue && <Home />}
      </div>

      {/* ── Footer ── */}
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
