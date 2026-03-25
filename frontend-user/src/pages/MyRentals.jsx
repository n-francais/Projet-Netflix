import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthProvider";
import { getMyRentals } from "../services/rentalService";

export default function MyRentals() {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier si l'utilisateur est authentifié
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Charger les locations depuis l'API
  useEffect(() => {
    const fetchRentals = async () => {
      if (!token) return;

      const result = await getMyRentals(token);

      if (result.success) {
        setRentals(result.rentals || []);
      } else {
        setError(result.error);
      }

      setLoading(false);
    };

    fetchRentals();
  }, [token]);

  // État de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <Navbar />

      <div className="px-4 md:px-12 pt-24 pb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Mes locations</h1>

        {error && (
          <div className="bg-primary/20 border border-primary text-primary px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {rentals.length === 0 ? (
          /* ── État vide ── */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            {/* Icône film */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-netflix-text mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <p className="text-netflix-text text-lg mb-6">
              Aucune location pour le moment
            </p>
            <Link
              to="/"
              className="bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded transition-colors"
            >
              Découvrir des films
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {rentals.map((rental) => (
              <Link
                key={rental._id}
                to={`/movie/${rental.movie._id}`}
                className="group"
              >
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={rental.movie.thumbnail}
                    alt={rental.movie.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-bold mt-2">{rental.movie.title}</h3>
                <p className="text-netflix-text text-xs">
                  Statut: {rental.status === "active" ? "En cours" : "Terminée"}
                </p>
                <p className="text-netflix-text text-xs">
                  Depuis le:{" "}
                  {new Date(rental.rentalDate).toLocaleDateString("fr-FR")}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
