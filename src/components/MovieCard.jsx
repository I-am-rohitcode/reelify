import { useNavigate } from "react-router-dom";
import { IMG_URL } from "../api/tmdb";
import { FaPlay, FaPlus } from "react-icons/fa";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  const title = movie.title || movie.name || "Untitled";
  const match =
    movie.vote_average && Number.isFinite(movie.vote_average)
      ? `${Math.round(movie.vote_average * 10)}% Match`
      : "New";

  return (
    <div
      onClick={() => {
        if (movie.media_type === "tv") {
          navigate(`/series/${movie.id}`);
        } else {
          navigate(`/movie/${movie.id}`);
        }
      }}
      className="relative cursor-pointer transition-all duration-300 transform hover:scale-[1.04] hover:-translate-y-2 hover:z-50 rounded-2xl overflow-hidden aspect-[2/3] group bg-white/5 border border-white/10 hover:border-white/20 shadow-glow"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (movie.media_type === "tv") navigate(`/series/${movie.id}`);
          else navigate(`/movie/${movie.id}`);
        }
      }}
    >
      <img
        src={
          movie.poster_path
            ? `${IMG_URL}${movie.poster_path}`
            : "https://via.placeholder.com/300x450?text=No+Image"
        }
        alt={title}
        className="w-full h-full object-cover transition duration-300 group-hover:opacity-40 group-hover:scale-[1.03]"
        loading="lazy"
      />
      
      {/* On-Hover Metadata Layover */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
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
          <button
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-black hover:bg-white/85 transition focus-ring"
            aria-label="Play"
            tabIndex={-1}
          >
            <FaPlay className="text-[10px] md:text-xs ml-0.5" />
          </button>
          <button
            className="flex items-center justify-center w-9 h-9 border border-white/30 rounded-full hover:border-white text-gray-200 hover:text-white transition focus-ring"
            aria-label="Add to watchlist"
            tabIndex={-1}
          >
            <FaPlus className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
