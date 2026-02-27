import { useState, useMemo, useCallback } from "react";

/**
 * useSearch — Hook custom pour la recherche de films
 *
 * Prend un tableau de films et retourne :
 *  - query : string            → valeur actuelle de la recherche
 *  - setQuery : function       → setter pour mettre à jour la recherche
 *  - filteredMovies : Movie[]  → films filtrés par titre, catégorie ou réalisateur
 *  - isSearching : boolean     → true si une recherche est active
 *  - clearSearch : function    → remet la recherche à vide
 *
 * Le filtrage est mémorisé via useMemo pour éviter les recalculs inutiles.
 * Utilise filter() + includes() (case-insensitive) sur title, category, director.
 */
const useSearch = (movies = []) => {
  const [query, setQuery] = useState("");

  const isSearching = query.trim().length > 0;

  /** Films filtrés — recalculé uniquement si query ou movies changent */
  const filteredMovies = useMemo(() => {
    if (!isSearching) return movies;

    const lowerQuery = query.toLowerCase().trim();

    return movies.filter(({ title, category, director, description }) => {
      return (
        title.toLowerCase().includes(lowerQuery) ||
        category.toLowerCase().includes(lowerQuery) ||
        director.toLowerCase().includes(lowerQuery) ||
        description.toLowerCase().includes(lowerQuery)
      );
    });
  }, [query, movies, isSearching]);

  /** Remet la recherche à zéro */
  const clearSearch = useCallback(() => {
    setQuery("");
  }, []);

  return {
    query,
    setQuery,
    filteredMovies,
    isSearching,
    clearSearch,
  };
};

export default useSearch;
