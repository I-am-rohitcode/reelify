import { Link } from "react-router-dom";
import { IMG_URL } from "../api/tmdb";
import { FaPlay, FaPlus } from "react-icons/fa";
import { getMovieUrl, getSeriesUrl } from "../utils/slug";

function MovieCard({ movie }) {
  if (!movie) return null;

  const title = movie.title || movie.name || "Untitled";
  const match =
    movie.vote_average && Number.isFinite(movie.vote_average)
      ? `${Math.round(movie.vote_average * 10)}% Match`
      : "New";

  const isTvShow =
    movie.media_type === "tv" ||
    (!movie.media_type && (movie.first_air_date || movie.name));

  const targetUrl = isTvShow ? getSeriesUrl(movie) : getMovieUrl(movie);
  const posterAlt = isTvShow ? `${title} series poster` : `${title} movie poster`;

  return (
    <Link
      to={targetUrl}
      className="relative block cursor-pointer transition-all duration-300 transform hover:scale-[1.04] hover:-translate-y-2 hover:z-50 rounded-2xl overflow-hidden aspect-[2/3] group/card bg-white/5 border border-white/10 hover:border-white/20 shadow-glow focus-ring"
      aria-label={`View details for ${title}`}
    >
      <img
        src={
          movie.poster_path
            ? `${IMG_URL}${movie.poster_path}`
            : "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22450%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20450%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder%7Bfill%3A%231a1a1a%3Bfont-weight%3Abold%3Bfont-family%3Asans-serif%3Bfont-size%3A18pt%3Bfill%3A%23555%7D%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder%22%3E%3Crect%20width%3D%22300%22%20height%3D%22450%22%20fill%3D%22%23111%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3ENo%20Poster%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fsvg%3E"
        }
        alt={posterAlt}
        width="300"
        height="450"
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition duration-300 group-hover/card:opacity-40 group-hover/card:scale-[1.03]"
      />

      {/* On-Hover Metadata Layover */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-black/55 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
        <p className="text-white font-bold text-sm md:text-base leading-tight drop-shadow-md truncate">
          {title}
        </p>

        <div className="flex items-center gap-2 mt-[6px]">
          <span className="text-neon-lime text-[11px] md:text-xs font-bold drop-shadow-sm">
            {match}
          </span>
          <span className="text-gray-200 text-[10px] md:text-xs font-medium border border-white/20 px-1.5 rounded">
            UHD
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-black group-hover/card:bg-white/90 transition shadow-sm"
            aria-hidden="true"
          >
            <FaPlay className="text-[10px] md:text-xs ml-0.5" />
          </span>
          <span
            className="flex items-center justify-center w-9 h-9 border border-white/30 rounded-full text-gray-200 group-hover/card:text-white group-hover/card:border-white transition"
            aria-hidden="true"
          >
            <FaPlus className="text-sm" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
