import { useState, useMemo } from "react";

/**
 * MovieFilter — Composant de filtrage par catégorie (TP04)
 *
 * Props (destructuring) :
 *  - movies   : Movie[]  → liste complète des films (source de vérité)
 *  - onFilter : function → callback pour remonter la liste filtrée au parent (Home)
 *
 * Fonctionnement :
 *  1. On extrait les catégories uniques depuis movies (useMemo)
 *  2. L'utilisateur clique sur un bouton de catégorie
 *  3. On applique .filter() sur la catégorie (insensible à la casse)
 *  4. Le résultat filtré est renvoyé au parent via onFilter(...)
 *     qui appelle en réalité setFilteredMovies dans Home
 *
 * ─────────────────────────────────────────────────────────
 *  L'attribut onFilter={setFilteredMovies} fonctionne ainsi :
 *
 *  Dans Home.jsx on écrit :
 *    <MovieFilter movies={allMovies} onFilter={setFilteredMovies} />
 *
 *  → React passe la RÉFÉRENCE de la fonction setFilteredMovies
 *    (le setter renvoyé par useState) comme valeur de la prop "onFilter".
 *
 *  → Quand MovieFilter appelle  onFilter(result)  c'est strictement
 *    équivalent à  setFilteredMovies(result)  dans Home.
 *    Cela met à jour le state filteredMovies et déclenche un re-render
 *    de Home → MovieList reçoit les données à jour.
 *
 *  C'est le pattern « lifting state up » de React : le state vit dans
 *  le parent, l'enfant reçoit un setter en prop pour le modifier.
 * ─────────────────────────────────────────────────────────
 */
const MovieFilter = ({ movies = [], onFilter }) => {
  // Catégorie sélectionnée ("Tous" par défaut)
  const [activeCategory, setActiveCategory] = useState("Tous");

  // Extraction des catégories uniques depuis la liste complète (useMemo)
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(movies.map(({ category }) => category)),
    ];
    return ["Tous", ...uniqueCategories.sort()];
  }, [movies]);

  /**
   * handleCategoryClick — appelé au clic sur un bouton de catégorie
   *
   * Utilise Array.prototype.filter() avec une comparaison
   * insensible à la casse grâce à toLowerCase().
   */
  const handleCategoryClick = (category) => {
    setActiveCategory(category);

    if (category === "Tous") {
      // "Tous" sélectionné → on renvoie la liste complète
      onFilter(movies);
    } else {
      // Filtrage par catégorie (insensible à la casse)
      const filtered = movies.filter(
        ({ category: movieCategory }) =>
          movieCategory.toLowerCase() === category.toLowerCase(),
      );

      // Remonte le résultat au parent (Home) via le callback
      onFilter(filtered);
    }
  };

  return (
    <div className="px-4 md:px-12 py-4">
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer
              ${
                activeCategory === category
                  ? "bg-netflix-dark border-2 border-primary text-white"
                  : "bg-netflix-dark border-2 border-transparent text-netflix-text hover:text-white hover:border-netflix-gray/50"
              }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MovieFilter;
