import { Link } from "react-router-dom";
import { BACKDROP_URL } from "../api/tmdb";
import { FaPlay, FaInfoCircle } from "react-icons/fa";
import { getMovieUrl, getSeriesUrl } from "../utils/slug";

function Hero({ movie }) {
  if (!movie) return null;

  const title = movie.title || movie.name || "Featured Movie";
  const isTvShow =
    movie.media_type === "tv" ||
    (!movie.media_type && (movie.first_air_date || movie.name));

  const targetUrl = isTvShow ? getSeriesUrl(movie) : getMovieUrl(movie);
  const backdropAlt = isTvShow ? `${title} series backdrop` : `${title} movie backdrop`;

  return (
    <section className="relative w-full h-[75vh] md:h-[90vh] lg:h-[95vh] overflow-hidden" aria-label="Featured Spotlight">
      {/* Background Image - Eager load with high fetchpriority for LCP */}
      <div className="absolute inset-0">
        <img
          src={`${BACKDROP_URL}${movie.backdrop_path}`}
          alt={backdropAlt}
          loading="eager"
          fetchpriority="high"
          decoding="async"
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
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-[0.04em] drop-shadow-[0_6px_18px_rgba(0,0,0,0.85)] leading-tight">
            {title}
          </h2>

          <p className="text-base md:text-lg lg:text-xl text-gray-200 drop-shadow-md font-medium max-w-xl">
            <span className="text-neon-lime font-bold mr-2 drop-shadow-sm">
              {movie.vote_average
                ? `${Math.round(movie.vote_average * 10)}% Match`
                : "New"}
            </span>
            {movie.release_date
              ? movie.release_date.split("-")[0]
              : movie.first_air_date
              ? movie.first_air_date.split("-")[0]
              : ""}
          </p>

          <p className="text-sm md:text-base lg:text-lg text-gray-300 line-clamp-3 md:line-clamp-4 drop-shadow-sm font-light max-w-2xl leading-relaxed">
            {movie.overview}
          </p>

          <div className="flex flex-wrap items-center gap-3 md:gap-4 pt-4">
            {/* Primary / Play */}
            <Link
              to={targetUrl}
              className="flex items-center gap-2 rounded-full px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-lg font-bold bg-white text-black hover:bg-white/85 transition-colors shadow-glow focus-ring"
              aria-label={`Play details for ${title}`}
            >
              <FaPlay className="text-base md:text-xl" />
              <span>Play</span>
            </Link>

            {/* Secondary / More Info */}
            <Link
              to={targetUrl}
              className="flex items-center gap-2 rounded-full px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-lg font-semibold glass-panel hover:bg-white/10 transition-colors shadow-glow focus-ring"
              aria-label={`More information about ${title}`}
            >
              <FaInfoCircle className="text-base md:text-xl" />
              <span>More Info</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
