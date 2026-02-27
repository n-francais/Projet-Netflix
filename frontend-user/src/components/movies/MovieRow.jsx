export default function MovieRow({ title, movies = [] }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-3 px-4">{title}</h2>
      <div className="flex gap-2 overflow-x-auto px-4 pb-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="min-w-[200px] cursor-pointer transition-transform hover:scale-105"
          >
            <img
              src={movie.image}
              alt={movie.title}
              className="w-full h-[300px] object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
