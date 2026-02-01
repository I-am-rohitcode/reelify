import { BACKDROP_URL } from "../api/tmdb";
import { useNavigate } from "react-router-dom";
import { FiInfo } from "react-icons/fi";

function Hero({ movie }) {
  const navigate = useNavigate();

  if (!movie) return null;

  const handleNavigate = () => {
    navigate(
      movie.media_type === "tv" ? `/series/${movie.id}` : `/movie/${movie.id}`,
    );
  };

  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] md:h-[85vh] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={`${BACKDROP_URL}${movie.backdrop_path}`}
          alt={movie.title || movie.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 hero-vignette" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full px-4 sm:px-8 md:px-16">
        <div className="max-w-xl text-white space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold drop-shadow-lg">
            {movie.title || movie.name}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-200 line-clamp-3 sm:line-clamp-4 drop-shadow-md">
            {movie.overview}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              {/* Play / Primary */}
              <button
                onClick={handleNavigate}
                className="flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 shadow-sm font-medium rounded-full text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5 focus:outline-none transition"
              >
                <span className="text-sm sm:text-base leading-none">▶</span>
                <span className=" xs:inline">Play</span>
              </button>

              {/* Info / Secondary */}
              <button
                onClick={handleNavigate}
                className="relative inline-flex items-center justify-center gap-2 p-0.5 overflow-hidden text-sm sm:text-base font-semibold text-white rounded-full group bg-gradient-to-br from-red-500 via-red-400 to-yellow-400 focus:ring-4 focus:outline-none focus:ring-red-300 transition"
              >
                <span className="relative flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-900/80 rounded-full group-hover:bg-transparent transition-all duration-75 leading-none">
                  <FiInfo className="text-base sm:text-lg leading-none" />
                  <span className=" xs:inline">More Info</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
