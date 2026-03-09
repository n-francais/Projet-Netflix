const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/**
 * Récupère tous les films depuis l'API backend.
 * @param {Object} params - Filtres optionnels : { category, isFeatured }
 * @returns {Promise<Array>} - Tableau de films
 */
export const fetchMovies = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${API_URL}/api/movies${query ? `?${query}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erreur API : ${res.status}`);
  const json = await res.json();
  return json.data;
};

/**
 * Récupère un film par son ID MongoDB.
 * @param {string} id - L'ID MongoDB du film
 * @returns {Promise<Object>} - Le film correspondant
 */
export const fetchMovieById = async (id) => {
  const res = await fetch(`${API_URL}/api/movies/${id}`);
  if (!res.ok) throw new Error(`Film introuvable : ${res.status}`);
  const json = await res.json();
  return json.data;
};
