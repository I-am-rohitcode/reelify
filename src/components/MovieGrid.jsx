import MovieCard from "./MovieCard";

function MovieGrid({ title, movies }) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="mb-8 p-4 md:pl-8 group">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">
        {title}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>

  );
}

export default MovieGrid;
