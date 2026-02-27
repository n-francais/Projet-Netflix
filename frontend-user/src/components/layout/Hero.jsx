export default function Hero() {
  return (
    <section className="relative h-[80vh] flex items-end pb-16 px-6 bg-gradient-to-t from-black to-gray-900">
      <div className="max-w-lg">
        <h1 className="text-5xl font-bold mb-4">Bienvenue sur Netflix</h1>
        <p className="text-lg text-gray-300 mb-6">
          Découvrez des milliers de films et séries en streaming.
        </p>
        <div className="flex gap-3">
          <button className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200">
            ▶ Lecture
          </button>
          <button className="bg-gray-600/70 text-white px-6 py-2 rounded font-semibold hover:bg-gray-600">
            ℹ Plus d'infos
          </button>
        </div>
      </div>
    </section>
  );
}
