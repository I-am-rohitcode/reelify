import MovieCard from "./MovieCard";

function MovieGrid({ title, movies }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4 border-l-4 border-red-600 pl-3">
        {title}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export default MovieGrid;
