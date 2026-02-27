import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-netflix-black text-white flex flex-col items-center justify-center px-4">
      {/* Code 404 géant */}
      <h1 className="text-[150px] md:text-[200px] font-bold leading-none text-primary">
        404
      </h1>

      <h2 className="text-2xl md:text-4xl font-bold mt-4 mb-2">
        Vous cherchez votre chemin ?
      </h2>

      <p className="text-netflix-text text-center max-w-md mb-8">
        Désolé, nous ne trouvons pas cette page. Vous trouverez beaucoup de
        choses à explorer sur la page d&apos;accueil.
      </p>

      <Link
        to="/"
        className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-3 rounded transition-colors"
      >
        Accueil Netflix
      </Link>
    </div>
  );
}
