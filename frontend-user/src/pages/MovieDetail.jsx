import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Breadcrumb from "../components/common/Breadcrumb";
import { useAuth } from "../context/AuthProvider";
import { getMovieDetails, createRental } from "../services/rentalService";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [renting, setRenting] = useState(false);
  const [notification, setNotification] = useState(null);

  // Charger les détails du film
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (error) {
        setNotification({
          type: "error",
          message: "Erreur lors du chargement du film",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleRent = async () => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    setRenting(true);
    const result = await createRental(token, id, 3.99);

    if (result.success) {
      setNotification({
        type: "success",
        message: "Film loué avec succès !",
      });
      setTimeout(() => {
        navigate("/my-rentals");
      }, 2000);
    } else {
      setNotification({
        type: "error",
        message: result.error || "Erreur lors de la location",
      });
    }

    setRenting(false);
  };

  // ─── État : Chargement ─────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black text-white flex flex-col items-center justify-center gap-4">
        {/* Spinner Netflix */}
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-netflix-text text-sm">Chargement…</p>
      </div>
    );
  }

  // ─── État : Film introuvable ───────────────────────────
  if (!movie) {
    return (
      <div className="min-h-screen bg-netflix-black text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">Film introuvable</h1>
        <p className="text-netflix-text">
          Le film que vous recherchez n&apos;existe pas.
        </p>
        <Link
          to="/"
          className="bg-primary hover:bg-primary-hover text-white font-bold px-6 py-2 rounded transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  const inCart = isInCart(movie.id);

  return (
    <div className="min-h-screen bg-netflix-black text-white">
      {/* ── Notification ── */}
      {notification && (
        <div
          className={`fixed top-20 right-4 px-6 py-3 rounded-lg shadow-xl z-50 text-white font-semibold ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Fil d'Ariane ── */}
      <div className="container mx-auto px-4 pt-24">
        <Breadcrumb
          items={[
            { label: "Films", path: "/" },
            { label: movie.category, path: `/?genre=${movie.category}` },
            { label: movie.title },
          ]}
        />
      </div>

      {/* ── Banner plein écran avec overlay ── */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <img
          src={movie.banner || movie.thumbnail}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black/70 via-transparent to-transparent" />

        {/* Bouton Retour */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-20 left-4 md:left-12 z-20 flex items-center gap-2 bg-netflix-gray/60 hover:bg-netflix-gray backdrop-blur-sm text-white px-4 py-2 rounded transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Retour
        </button>

        {/* Titre + badges sur le banner */}
        <div className="absolute bottom-12 left-4 md:left-12 z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="bg-primary text-white font-bold px-2 py-0.5 rounded">
              {movie.rating}/10
            </span>
            <span className="text-netflix-light">{movie.year}</span>
            <span className="text-netflix-light">{movie.duration} min</span>
            <span className="border border-white/30 px-2 py-0.5 rounded text-netflix-light text-xs">
              {movie.category}
            </span>
          </div>
        </div>
      </section>

      {/* ── Contenu principal ── */}
      <section className="px-4 md:px-12 py-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Colonne gauche : synopsis + bouton louer + infos */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
            <p className="text-netflix-light leading-relaxed mb-6">
              {movie.description}
            </p>

            {/* Bouton Louer */}
            <button
              onClick={handleRent}
              disabled={inCart}
              className={`flex items-center gap-2 px-6 py-3 rounded font-bold text-sm transition-all duration-200 mb-8 ${
                inCart
                  ? "bg-green-600 text-white cursor-default"
                  : "bg-primary hover:bg-primary-hover text-white"
              }`}
            >
              {inCart ? <>✓ Loué</> : <>🎬 Louer pour 3.99€</>}
            </button>

            {/* Tableau d'informations */}
            <div className="border border-white/10 rounded-lg overflow-hidden">
              <div className="bg-white/5 px-4 py-2 font-bold text-sm border-b border-white/10">
                Informations
              </div>
              <table className="w-full text-sm">
                <thead className="sr-only">
                  <tr>
                    <th>Propriété</th>
                    <th>Valeur</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5 text-netflix-text font-medium">
                      Réalisateur
                    </td>
                    <td className="px-4 py-2.5">{movie.director}</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5 text-netflix-text font-medium">
                      Année
                    </td>
                    <td className="px-4 py-2.5">{movie.year}</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5 text-netflix-text font-medium">
                      Durée
                    </td>
                    <td className="px-4 py-2.5">{movie.duration} minutes</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-netflix-text font-medium">
                      Note
                    </td>
                    <td className="px-4 py-2.5 text-primary font-bold">
                      {movie.rating}/10
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Colonne droite : poster */}
          <div className="w-full md:w-72 shrink-0">
            <img
              src={movie.image}
              alt={movie.title}
              className="w-full rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 px-4 md:px-12 py-8 text-center text-netflix-text text-xs">
        <p>© 2026 Netflix Clone — Projet R4.10</p>
      </footer>
    </div>
  );
}
