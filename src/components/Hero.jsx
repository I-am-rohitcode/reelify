import { BACKDROP_URL } from "../api/tmdb";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaInfoCircle } from "react-icons/fa";

function Hero({ movie }) {
  const navigate = useNavigate();

  if (!movie) return null;

  const handleNavigate = () => {
    navigate(
      movie.media_type === "tv" ? `/series/${movie.id}` : `/movie/${movie.id}`,
    );
  };

  return (
    <section className="relative w-full h-[75vh] md:h-[90vh] lg:h-[95vh] overflow-hidden ">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={`${BACKDROP_URL}${movie.backdrop_path}`}
          alt={movie.title || movie.name}
          loading="lazy"
          className="w-full h-full object-cover object-top scale-105"
        />
        {/* Layered cinematic gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.20),transparent_50%),radial-gradient(circle_at_75%_15%,rgba(244,114,182,0.14),transparent_55%)] mix-blend-screen opacity-70" />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 flex items-center h-full px-4 md:px-12 lg:px-16 pb-20">
        <div className="max-w-2xl text-white space-y-4 md:space-y-6 animate-fade-in-up">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-[0.04em] drop-shadow-[0_6px_18px_rgba(0,0,0,0.85)] leading-tight">
            {movie.title || movie.name}
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-gray-200 drop-shadow-md font-medium max-w-xl">
            <span className="text-neon-lime font-bold mr-2 drop-shadow-sm">
              {movie.vote_average
                ? `${Math.round(movie.vote_average * 10)}% Match`
                : "New"}
            </span>
            {movie.release_date ? movie.release_date.split("-")[0] : ""}
          </p>

          <p className="text-sm md:text-base lg:text-lg text-gray-300 line-clamp-3 md:line-clamp-4 drop-shadow-sm font-light max-w-2xl leading-relaxed">
            {movie.overview}
          </p>

          <div className="flex flex-wrap items-center gap-3 md:gap-4 pt-4">
            {/* Primary / Play */}
            <button
              onClick={handleNavigate}
              className="flex items-center gap-2 rounded-full px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-lg font-bold bg-white text-black hover:bg-white/85 transition-colors shadow-glow focus-ring"
            >
              <FaPlay className="text-base md:text-xl" />
              <span>Play</span>
            </button>

            {/* Secondary / More Info */}
            <button
              onClick={handleNavigate}
              className="flex items-center gap-2 rounded-full px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-lg font-semibold glass-panel hover:bg-white/10 transition-colors shadow-glow focus-ring"
            >
              <FaInfoCircle className="text-base md:text-xl" />
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
