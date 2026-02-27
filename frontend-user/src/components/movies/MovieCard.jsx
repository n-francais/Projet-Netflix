export default function MovieCard({ movie }) {
  return (
    <div className="min-w-[200px] cursor-pointer transition-transform hover:scale-105">
      <img
        src={movie?.image || "https://via.placeholder.com/200x300"}
        alt={movie?.title || "Film"}
        className="w-full h-[300px] object-cover rounded"
      />
      <p className="mt-2 text-sm text-gray-300">{movie?.title}</p>
    </div>
  );
}
