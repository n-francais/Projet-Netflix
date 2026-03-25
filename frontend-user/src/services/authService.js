const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/**
 * Enregistrer un nouvel utilisateur
 * @param {string} email
 * @param {string} password
 * @param {string} name (optionnel)
 * @returns {Promise<Object>} - { success, token, user, error }
 */
export const registerUser = async (email, password, name) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Erreur lors de l\'enregistrement',
      };
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erreur réseau : ' + error.message,
    };
  }
};

/**
 * Connexion d'un utilisateur
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} - { success, token, user, error }
 */
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Erreur lors de la connexion',
      };
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erreur réseau : ' + error.message,
    };
  }
};

/**
 * Récupérer le profil de l'utilisateur connecté
 * @param {string} token - JWT token
 * @returns {Promise<Object>} - { success, user, error }
 */
export const getCurrentUser = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
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
        error: data.message || 'Erreur lors de la récupération du profil',
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erreur réseau : ' + error.message,
    };
  }
};
