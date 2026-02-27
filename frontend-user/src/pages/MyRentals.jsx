import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

export default function MyRentals() {
  const [rentals, setRentals] = useState([]);

  // Charger les locations depuis localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("rentals") || "[]");
    setRentals(stored);
  }, []);

  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <Navbar />

      <div className="px-4 md:px-12 pt-24 pb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Mes locations</h1>

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
          /* ── Grille des films loués ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {rentals.map((movie) => (
              <Link key={movie.id} to={`/movie/${movie.id}`} className="group">
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={movie.banner || movie.image}
                    alt={movie.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-bold mt-2">{movie.title}</h3>
                <p className="text-netflix-text text-xs">
                  Expire le:{" "}
                  {new Date(movie.expiryDate).toLocaleDateString("fr-FR")}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
