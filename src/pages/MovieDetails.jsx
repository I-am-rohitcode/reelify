import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getSimilarMovies,
  BACKDROP_URL,
  IMG_URL,
} from "../api/tmdb";

import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  const sectionsRef = useRef([]);

  /* Fetch all data */
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);

        const [d, c, v, s] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
          getMovieVideos(id),
          getSimilarMovies(id),
        ]);

        setMovie(d.data);
        setCast(c.data.cast.slice(0, 12));
        setSimilar(s.data.results.slice(0, 12));

        const t = v.data.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube",
        );
        setTrailer(t?.key);

        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Failed to load movie details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  /* Scroll animations */
  useEffect(() => {
    if (!movie) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.15 },
    );

    sectionsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [movie]);

  if (loading) return <Loader />;
  if (!movie) return <p className="p-6">Movie not found.</p>;

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="hidden md:flex fixed top-32 left-6 z-20
             items-center gap-2
             bg-black/70 text-white border border-white px-4 py-2 rounded
             hover:bg-white hover:text-black transition"
      >
        ← Back
      </button>

      {/* Banner */}
      <img
        src={
          movie.backdrop_path
            ? BACKDROP_URL + movie.backdrop_path
            : IMG_URL + movie.poster_path
        }
        alt={movie.title}
        className="hero-banner"
      />

      <div className="details-body">
        {/* Title */}
        <h1 className="details-title">{movie.title}</h1>

        {/* Meta */}
        <div className="details-meta flex flex-wrap items-center gap-6 text-sm">
          {/* Rating */}
          <span className="flex items-center gap-1 text-green-400 font-semibold">
            ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
          </span>

          {/* Release Date */}
          {movie.release_date && (
            <span className="text-gray-300">
              {" "}
              {new Date(movie.release_date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          )}

          {/* Runtime */}
          {movie.runtime && (
            <span className="text-gray-300"> {movie.runtime} min</span>
          )}
        </div>

        {/* Tagline */}
        {movie.tagline && <div className="tagline">"{movie.tagline}"</div>}

        {/* Overview */}
        <div
          ref={(el) => (sectionsRef.current[0] = el)}
          className="fade-section"
        >
          <h3 className="text-xl font-semibold mb-2">Overview</h3>
          <p className="overview">
            {movie.overview || "No overview available."}
          </p>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-2 mb-10">
          {movie.genres?.map((g) => (
            <span
              key={g.id}
              className="border border-gray-500 rounded-full px-4 py-1 text-xs"
            >
              {g.name}
            </span>
          ))}
        </div>

        {/* Trailer */}
        {trailer && (
          <div
            ref={(el) => (sectionsRef.current[1] = el)}
            className="video-container fade-section mb-12"
          >
            <h3 className="text-xl font-semibold mb-2">Official Trailer</h3>
            <iframe
              src={`https://www.youtube.com/embed/${trailer}`}
              title="Trailer"
              allowFullScreen
            />
          </div>
        )}

        {/* Cast */}
        <div
          ref={(el) => (sectionsRef.current[2] = el)}
          className="fade-section mb-14"
        >
          <h3 className="text-xl font-semibold mb-4">Top Cast</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
            {cast.map((actor) => (
              <div
                key={actor.id}
                onClick={() => navigate(`/actor/${actor.id}`)}
                className="group text-center cursor-pointer transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <img
                    src={
                      actor.profile_path
                        ? IMG_URL + actor.profile_path
                        : "https://via.placeholder.com/100"
                    }
                    alt={actor.name}
                    className="w-full h-full rounded-full object-cover border border-gray-700 shadow-md"
                  />

                  {/* subtle hover ring */}
                  <div className="absolute inset-0 rounded-full ring-2 ring-transparent group-hover:ring-red-500 transition"></div>
                </div>

                <div className="text-sm font-semibold leading-tight">
                  {actor.name}
                </div>

                <div className="text-xs text-gray-400 mt-0.5">
                  {actor.character}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Movies */}
        <div
          ref={(el) => (sectionsRef.current[3] = el)}
          className="fade-section"
        >
          <h3 className="text-xl font-semibold mb-4">Similar Movies</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {similar.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
