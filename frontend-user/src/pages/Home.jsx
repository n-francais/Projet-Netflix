import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/layout/Hero";
import MovieFilter from "../components/movies/MovieFilter";
import MovieList from "../components/movies/MovieList";
import allMoviesData from "../../../data/movies.json";

const Home = () => {
  // ─── State ─────────────────────────────────────────────
  const [allMovies] = useState(allMoviesData);
  const [filteredMovies, setFilteredMovies] = useState(allMoviesData);

  // Film mis en avant dans le Hero (le premier du JSON)
  const featuredMovie = allMoviesData[0];

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

      {/* ── Hero Banner ── */}
      <Hero movie={featuredMovie} />

      {/* ── Filtre + liste de films ── */}
      <div className="pt-6">
        <MovieFilter movies={allMovies} onFilter={setFilteredMovies} />
        <MovieList movies={filteredMovies} title="Films disponibles" />
      </div>
    </div>
  );
};

export default Home;
