export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black/90 fixed w-full z-50">
      <div className="flex items-center gap-8">
        <h1 className="text-red-600 text-3xl font-bold">NETFLIX</h1>
        <ul className="hidden md:flex gap-4 text-sm">
          <li className="hover:text-gray-300 cursor-pointer">Accueil</li>
          <li className="hover:text-gray-300 cursor-pointer">Séries</li>
          <li className="hover:text-gray-300 cursor-pointer">Films</li>
          <li className="hover:text-gray-300 cursor-pointer">Nouveautés</li>
        </ul>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-white hover:text-gray-300">🔍</button>
        <button className="text-white hover:text-gray-300">🔔</button>
        <div className="w-8 h-8 bg-red-600 rounded"></div>
      </div>
    </nav>
  );
}
