import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/layout/Hero";
import MovieFilter from "../components/movies/MovieFilter";
import MovieList from "../components/movies/MovieList";
import { fetchMovies } from "../services/movieService";

const Home = () => {
  // ─── State ─────────────────────────────────────────────
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Film mis en avant dans le Hero (le premier de la liste)
  const featuredMovie = allMovies[0] ?? null;

  // ─── Chargement depuis l'API ────────────────────────────
  useEffect(() => {
    fetchMovies()
      .then((data) => {
        setAllMovies(data);
        setFilteredMovies(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (allMovies.length > 0) {
      console.log(
        `🔍 Filtre actif : ${filteredMovies.length}/${allMovies.length} films affichés`,
      );
    }
  }, [filteredMovies, allMovies]);

  return (
    <div className="bg-netflix-black min-h-screen text-white">
      {/* ── Navbar ── */}
      <Navbar />

      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-netflix-text text-lg">Chargement des films…</p>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-primary text-lg">Erreur : {error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* ── Hero Banner ── */}
          <Hero movie={featuredMovie} />

          {/* ── Filtre + liste de films ── */}
          <div className="pt-6">
            <MovieFilter movies={allMovies} onFilter={setFilteredMovies} />
            <MovieList movies={filteredMovies} title="Films disponibles" />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
