import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getSimilarMovies,
  getMovieReviews,
  BACKDROP_URL,
  IMG_URL,
} from "../api/tmdb";
import { FaPlay, FaStar, FaArrowLeft, FaBookmark, FaUserCircle, FaQuoteLeft } from "react-icons/fa";

import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Fetch all data */
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);

        const [d, c, v, s, r] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
          getMovieVideos(id),
          getSimilarMovies(id),
          getMovieReviews(id)
        ]);

        setMovie(d.data);
        setCast(c.data.cast.filter(actor => actor.profile_path).slice(0, 12));
        setSimilar(s.data.results.slice(0, 12));
        setReviews(r.data.results.slice(0, 6)); // Top 6 reviews

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

  if (loading) return <Loader />;
  if (!movie) return <div className="text-center p-20 text-xl text-gray-400">Movie not found.</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-600/40">

      {/* Floating Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="hidden md:flex fixed top-24 left-6 lg:left-10 z-50 items-center gap-2 px-5 py-2.5 rounded-full glass-panel hover:bg-white/10 transition-colors shadow-lg shadow-black/50 text-sm font-medium"
      >
        <FaArrowLeft /> Back
      </button>

      {/* Hero Banner Section */}
      <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
        {/* Background Image Wrapper */}
        <div className="absolute inset-0">
          <img
            src={
              movie.backdrop_path
                ? BACKDROP_URL + movie.backdrop_path
                : IMG_URL + movie.poster_path
            }
            alt={movie.title}
            className="w-full h-full object-cover object-top opacity-40 scale-105"
          />
        </div>

        {/* Overlay Gradients */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent"></div>*/}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505] hidden md:block"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 to-purple-900/20 mix-blend-overlay"></div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 w-full px-6 md:px-16 lg:px-24 pb-12 z-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            {movie.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium mb-6">
            <span className="flex items-center gap-1.5 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
              <FaStar /> {movie.vote_average ? movie.vote_average.toFixed(1) : "NR"}
            </span>
            {movie.release_date && (
              <span className="text-gray-300">
                {new Date(movie.release_date).getFullYear()}
              </span>
            )}
            {movie.runtime > 0 && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                <span className="text-gray-300">{movie.runtime} min</span>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {movie.genres?.map((g) => (
              <span
                key={g.id}
                className="glass-panel px-4 py-1.5 rounded-full text-xs md:text-sm font-medium tracking-wide text-gray-200"
              >
                {g.name}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {trailer && (
              <a
                href={`#trailer`}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-3.5 rounded-full font-semibold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(124,58,237,0.4)]"
              >
                <FaPlay className="text-sm" /> Watch Trailer
              </a>
            )}
            <button className="flex items-center gap-2 glass-panel hover:bg-white/10 px-8 py-3.5 rounded-full font-semibold transition-all">
              <FaBookmark className="text-sm text-gray-300" /> Watchlist
            </button>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="px-6 md:px-16 lg:px-24 py-12 max-w-[1600px] mx-auto space-y-20">

        {/* Overview Row: Split layout for large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-fade-in-up delay-100">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold border-b border-gray-800 pb-4">
              Storyline
            </h2>
            {movie.tagline && (
              <p className="text-lg md:text-xl text-purple-400 italic font-medium">
                "{movie.tagline}"
              </p>
            )}
            <p className="text-gray-300 text-lg leading-relaxed font-light">
              {movie.overview || "No overview available."}
            </p>
          </div>

          {/* Quick Info Sidebar */}
          <div className="glass-panel rounded-2xl p-6 lg:p-8 space-y-6 self-start">
            <h3 className="text-xl font-bold mb-4 text-gray-100">Info</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Status</p>
                <p className="font-medium">{movie.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Release Date</p>
                <p className="font-medium">
                  {movie.release_date
                    ? new Date(movie.release_date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                    : "Unknown"}
                </p>
              </div>
              {movie.budget > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Budget</p>
                  <p className="font-medium">${(movie.budget / 1000000).toFixed(1)}M</p>
                </div>
              )}
              {movie.revenue > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Revenue</p>
                  <p className="font-medium">${(movie.revenue / 1000000).toFixed(1)}M</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cast Section */}
        {cast.length > 0 && (
          <div className="animate-fade-in-up delay-200">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center justify-between">
              <span>Top Cast</span>
              <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition">See all</button>
            </h2>

            <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x">
              {cast.map((actor) => (
                <div
                  key={actor.id}
                  onClick={() => navigate(`/actor/${actor.id}`)}
                  className="snap-start flex-none w-[140px] group cursor-pointer"
                >
                  <div className="w-[140px] h-[140px] mb-4 overflow-hidden rounded-full border-2 border-transparent group-hover:border-indigo-500 transition-all duration-300 shadow-lg relative p-1">
                    <img
                      src={IMG_URL + actor.profile_path}
                      alt={actor.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h4 className="font-semibold text-center truncate group-hover:text-indigo-400 transition-colors">
                    {actor.name}
                  </h4>
                  <p className="text-xs text-center text-gray-400 mt-1 truncate">
                    {actor.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trailer Section */}
        {trailer && (
          <div id="trailer" className="animate-fade-in-up delay-300 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Official Trailer</h2>
            <div className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden glass-panel p-2 shadow-2xl">
              <div className="aspect-video rounded-2xl overflow-hidden bg-black relative">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${trailer}?color=white`}
                  title="Trailer"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="animate-fade-in-up delay-400">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">User Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:bg-white/5 transition-colors">
                  <div>
                    <FaQuoteLeft className="text-gray-600 text-2xl mb-4" />
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 mb-6">
                      {review.content}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-800 pt-4 mt-auto">
                    <div className="flex items-center gap-3">
                      <FaUserCircle className="text-3xl text-gray-500" />
                      <div>
                        <p className="font-semibold text-sm">{review.author}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {review.author_details?.rating && (
                      <span className="flex items-center gap-1 text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
                        <FaStar /> {review.author_details.rating}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Movies */}
        {similar.length > 0 && (
          <div className="animate-fade-in-up delay-400 relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">More Like This</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {similar.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;

