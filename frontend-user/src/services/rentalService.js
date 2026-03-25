const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/**
 * Récupère les détails complets d'un film
 * @param {string} id - L'ID MongoDB du film
 * @returns {Promise<Object>} - Le film avec tous les détails
 */
export const getMovieDetails = async (id) => {
  try {
    const res = await fetch(`${API_URL}/api/movies/${id}`);
    if (!res.ok) throw new Error(`Film introuvable : ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (error) {
    throw new Error('Erreur lors de la récupération du film : ' + error.message);
  }
};

/**
 * Crée une nouvelle location pour un utilisateur
 * @param {string} token - JWT token
 * @param {string} movieId - ID du film
 * @param {number} price - Prix de la location
 * @returns {Promise<Object>} - { success, rental, error }
 */
export const createRental = async (token, movieId, price = 3.99) => {
  try {
    const response = await fetch(`${API_URL}/api/rentals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ movieId, price }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Erreur lors de la création de la location',
      };
    }

    return {
      success: true,
      rental: data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erreur réseau : ' + error.message,
    };
  }
};

/**
 * Récupère les locations de l'utilisateur
 * @param {string} token - JWT token
 * @returns {Promise<Array|Object>} - { success, rentals, error }
 */
export const getMyRentals = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/rentals/my-rentals`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Erreur lors de la récupération des locations',
      };
    }

    return {
      success: true,
      rentals: data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erreur réseau : ' + error.message,
    };
  }
};

/**
 * Annule une location
 * @param {string} token - JWT token
 * @param {string} rentalId - ID de la location
 * @returns {Promise<Object>} - { success, error }
 */
export const cancelRental = async (token, rentalId) => {
  try {
    const response = await fetch(`${API_URL}/api/rentals/${rentalId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Erreur lors de l\'annulation',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erreur réseau : ' + error.message,
    };
  }
};

/**
 * Récupère les recommandations personnalisées
 * @param {string} token - JWT token
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} - { success, recommendations, error }
 */
export const getRecommendations = async (token, userId) => {
  try {
    const response = await fetch(
      `${API_URL}/api/rentals/recommendations?userId=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Erreur lors de la récupération des recommandations',
      };
    }

    return {
      success: true,
      recommendations: data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erreur réseau : ' + error.message,
    };
  }
};
