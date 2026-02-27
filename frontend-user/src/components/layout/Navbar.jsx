import { useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  // Détecte le scroll pour changer le fond de la navbar
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setScrolled(window.scrollY > 50);
    });
  }

  const links = ["Accueil", "Séries", "Films", "Nouveautés", "Ma liste"];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-4 md:px-12 py-3 flex items-center justify-between ${
        scrolled
          ? "bg-netflix-black shadow-lg"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      {/* Logo + Liens */}
      <div className="flex items-center gap-8">
        <h1 className="text-primary text-3xl font-bold tracking-wider cursor-pointer">
          NETFLIX
        </h1>
        <ul className="hidden md:flex items-center gap-5 text-sm">
          {links.map((link) => (
            <li
              key={link}
              className="text-netflix-light hover:text-white transition-colors duration-300 cursor-pointer"
            >
              {link}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions droite */}
      <div className="flex items-center gap-5">
        <button className="text-netflix-light hover:text-white transition-colors">
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
        <button className="text-netflix-light hover:text-white transition-colors relative">
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
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute -top-1 -right-1 bg-primary text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>
        <div className="w-8 h-8 rounded bg-primary cursor-pointer overflow-hidden">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </nav>
  );
}
