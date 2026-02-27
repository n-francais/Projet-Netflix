import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import MovieCard from "../components/movies/MovieCard";
import allMoviesData from "../../../data/movies.json";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [genreFilter, setGenreFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  // Extraire tous les genres uniques
  const genres = useMemo(() => {
    const set = new Set(allMoviesData.map((m) => m.category));
    return [...set].sort();
  }, []);

  // Filtrer et trier les résultats
  const results = useMemo(() => {
    let filtered = allMoviesData;

    // Filtre par recherche textuelle
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          m.director?.toLowerCase().includes(q),
      );
    }

    // Filtre par genre
    if (genreFilter !== "all") {
      filtered = filtered.filter((m) => m.category === genreFilter);
    }

    // Tri
    const sorted = [...filtered];
    switch (sortBy) {
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "year":
        sorted.sort((a, b) => b.year - a.year);
        break;
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return sorted;
  }, [query, genreFilter, sortBy]);

  // Mettre à jour le query param depuis la Navbar
  const handleSearchChange = (value) => {
    setSearchParams(value ? { q: value } : {});
  };

  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <Navbar searchQuery={query} onSearchChange={handleSearchChange} />

      <div className="px-4 md:px-12 pt-24 pb-12">
        {/* Titre */}
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          Résultats pour &quot;{query}&quot;
        </h1>
        <p className="text-netflix-text text-sm mb-6">
          {results.length} film{results.length !== 1 ? "s" : ""} trouvé
          {results.length !== 1 ? "s" : ""}
        </p>

        {/* Filtres */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Filtre genre */}
          <div className="relative">
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="appearance-none bg-netflix-gray/60 text-white text-sm px-4 py-2 pr-8 rounded cursor-pointer outline-none border border-white/10 hover:border-white/30 transition-colors"
            >
              <option value="all">Tous les genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Tri */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-netflix-gray/60 text-white text-sm px-4 py-2 pr-8 rounded cursor-pointer outline-none border border-white/10 hover:border-white/30 transition-colors"
            >
              <option value="rating">Note</option>
              <option value="year">Année</option>
              <option value="title">Titre</option>
            </select>
            <svg
              className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Résultats */}
        {results.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-netflix-text text-lg">Aucun résultat trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
