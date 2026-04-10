import MovieCard from "./MovieCard";

function MovieGrid({ title, movies }) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="mb-6 md:mb-10 relative group z-20">
      <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 text-gray-100 px-4 md:px-12 lg:px-16 drop-shadow-md">
        {title}
      </h2>

      <div className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory px-4 md:px-12 lg:px-16 pb-6 pt-2">
        {movies.map((movie) => (
          <div key={movie.id} className="snap-start flex-none w-[140px] sm:w-[160px] md:w-[220px] lg:w-[260px]">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieGrid;
