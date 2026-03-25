import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Fonction de connexion
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const result = await loginUser(email, password);

      if (result.success) {
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        setToken(result.token);
        setUser(result.user);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);
  // Fonction d'inscription
  const register = useCallback(async (email, password, name) => {
    setLoading(true);
    try {
      const result = await registerUser(email, password, name);

      if (result.success) {
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        setToken(result.token);
        setUser(result.user);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);
  // Fonction de déconnexion
  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);
  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = useCallback(() => {
    return !!token && !!user;
  }, [token, user]);
  // Mettre à jour le profil
  const updateProfile = useCallback(
    (updates) => {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    },
    [user],
  );
  // Mettre à disposition les éléments pour être utilisés dans les composants
  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAuthenticated,
      updateProfile,
    }),
    [
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAuthenticated,
      updateProfile,
    ],
  );
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
