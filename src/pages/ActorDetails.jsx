import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPersonDetails, getPersonMovies, IMG_URL } from "../api/tmdb";
import Loader from "../components/Loader";
import MovieCard from "../components/MovieCard";

function ActorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActor = async () => {
      try {
        setLoading(true);

        const [a, m] = await Promise.all([
          getPersonDetails(id),
          getPersonMovies(id),
        ]);

        setActor(a.data);
        setMovies(m.data.cast.slice(0, 12));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActor();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <Loader />;
  if (!actor) return <p className="p-6">Actor not found</p>;

  return (
    <div className="px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="hidden md:flex fixed top-32 left-6 z-20
             items-center gap-2
             bg-black/70 text-white border border-white px-4 py-2 rounded
             hover:bg-white hover:text-black transition"
      >
        ← Back
      </button>

      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 shadow-2xl">
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.25),transparent_60%)]"></div>

        <div className="relative flex flex-col md:flex-row gap-10 p-8">
          {/* Actor Image */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="relative">
              <img
                src={
                  actor.profile_path
                    ? IMG_URL + actor.profile_path
                    : "https://via.placeholder.com/300"
                }
                alt={actor.name}
                className="w-60 h-80 object-cover rounded-xl shadow-xl border border-gray-700"
              />

              {/* Glow ring */}
              <div className="absolute inset-0 rounded-xl ring-2 ring-red-600/40 pointer-events-none"></div>
            </div>
          </div>

          {/* Actor Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight mb-3">
              {actor.name}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6 text-sm">
              {actor.birthday && (
                <span className="px-4 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                  🎂 {actor.birthday}
                </span>
              )}

              {actor.place_of_birth && (
                <span className="px-4 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                  📍 {actor.place_of_birth}
                </span>
              )}

              {actor.known_for_department && (
                <span className="px-4 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-600/40">
                  🎬 {actor.known_for_department}
                </span>
              )}
            </div>

            {/* Biography */}
            <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto md:mx-0">
              {actor.biography
                ? actor.biography
                : "Biography not available for this actor yet."}
            </p>
          </div>
        </div>
      </div>

      {/* Actor Movies */}
      {movies.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Movies by {actor.name}</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ActorDetails;
