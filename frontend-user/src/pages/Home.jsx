import { useState, useEffect } from "react";
import MovieFilter from "../components/movies/MovieFilter";
import MovieList from "../components/movies/MovieList";
import allMoviesData from "../../../data/movies.json";

/**
 * Home — Page d'accueil avec filtrage de films (TP04)
 *
 * Architecture du filtrage :
 *
 *  ┌─────────────────────────────────┐
 *  │            Home.jsx             │
 *  │                                 │
 *  │  allMovies ──────► MovieFilter  │  (reçoit la liste complète)
 *  │                        │        │
 *  │            onFilter = setFilteredMovies
 *  │                        │        │
 *  │                        ▼        │
 *  │  filteredMovies ─────► MovieList│  (affiche le résultat filtré)
 *  └─────────────────────────────────┘
 *
 * Hooks utilisés :
 *  - useState  : allMovies (liste complète), filteredMovies (liste filtrée)
 *  - useEffect : initialise filteredMovies avec allMovies au chargement
 *
 * L'attribut onFilter={setFilteredMovies} :
 *   → Passe la RÉFÉRENCE du setter useState au composant enfant MovieFilter.
 *   → Quand MovieFilter appelle onFilter(result), c'est équivalent à
 *     setFilteredMovies(result) dans Home → re-render avec les données filtrées.
 *   → C'est le pattern "lifting state up" : le state reste dans le parent,
 *     l'enfant le modifie via un callback passé en props.
 */
const Home = () => {
  // ─── State ─────────────────────────────────────────────
  // allMovies : liste complète (source de vérité, ne change jamais)
  const [allMovies, setAllMovies] = useState([]);
  // filteredMovies : liste filtrée affichée par MovieList
  const [filteredMovies, setFilteredMovies] = useState([]);

  // ─── useEffect : initialisation au montage ─────────────
  // Au chargement de la page, on charge les films depuis le JSON
  // et on initialise filteredMovies avec la totalité de allMovies.
  // Ainsi, par défaut, TOUS les films sont affichés.
  useEffect(() => {
    setAllMovies(allMoviesData);
    setFilteredMovies(allMoviesData); // ← initialisation : filtré = complet
    console.log(`🎬 Home : ${allMoviesData.length} films chargés`);
  }, []);

  // ─── useEffect : log lors des changements de filtre ────
  useEffect(() => {
    if (allMovies.length > 0) {
      console.log(
        `🔍 Filtre actif : ${filteredMovies.length}/${allMovies.length} films affichés`,
      );
    }
  }, [filteredMovies, allMovies]);

  return (
    <div className="pt-6">
      {/* ── Titre supprimé : le filtre + MovieList suffisent ── */}

      {/*
        ── MovieFilter ──
        Reçoit la liste COMPLÈTE (allMovies) pour pouvoir filtrer dessus.
        onFilter={setFilteredMovies} : passe le setter directement.
        → À chaque frappe, MovieFilter appelle onFilter(filmsFiltres)
          ce qui met à jour filteredMovies et déclenche le re-render.
      */}
      <MovieFilter movies={allMovies} onFilter={setFilteredMovies} />

      {/*
        ── MovieList ──
        Affiche UNIQUEMENT filteredMovies (et non allMovies).
        Grâce au useEffect initial, filteredMovies === allMovies au départ.
        Dès que l'utilisateur tape dans MovieFilter, la liste se réduit.
      */}
      <MovieList movies={filteredMovies} title="Films disponibles" />
    </div>
  );
};

export default Home;
