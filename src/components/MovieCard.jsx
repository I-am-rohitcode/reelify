import { useNavigate } from "react-router-dom";
import { IMG_URL } from "../api/tmdb";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="cursor-pointer hover:scale-105 transition"
    >
      <img
        src={
          movie.poster_path
            ? IMG_URL + movie.poster_path
            : "https://via.placeholder.com/300x450"
        }
        className="rounded"
        alt={movie.title}
      />
      <p className="mt-2 text-sm font-semibold">{movie.title}</p>
      <p
        style={{
          color: "#46d369",
          fontSize: "1rem",
          fontWeight: "bold",
        }}
      >
        {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} / 10
      </p>
      <p className="text-xs text-gray-400 mt-1">
        {movie.release_date
          ? new Date(movie.release_date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "Release date unknown"}
      </p>
    </div>
  );
}

export default MovieCard;
