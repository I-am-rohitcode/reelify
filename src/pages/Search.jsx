import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMulti } from "../api/tmdb";
import { useBollywood } from "../context/BollywoodContext";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";
import { FaSearch } from "react-icons/fa";

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { bollywoodOnly } = useBollywood();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      setLoading(false);
      setError("");
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await searchMulti(query, bollywoodOnly);

        // keep only movies & tv series
        const filtered = res.data.results.filter(
          (item) => item.media_type === "movie" || item.media_type === "tv",
        );

        setResults(filtered);
      } catch (err) {
        console.error("Search failed", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchResults, 400);
    return () => clearTimeout(delay);
  }, [query, bollywoodOnly]);

  /* ================= UI STATES ================= */

  if (loading) {
    return (
      <div className="animate-fade-in min-h-screen pt-32">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 md:px-12 lg:px-16 py-32 min-h-screen">
        <div className="mx-auto max-w-2xl glass-panel rounded-3xl p-8 border border-white/10 shadow-glow text-center">
          <p className="text-neon-magenta font-semibold">Search failed</p>
          <p className="mt-2 text-gray-200">{error}</p>
          <p className="mt-4 text-sm text-gray-400">
            Tip: try a shorter title or different spelling.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 md:px-12 lg:px-16 py-32">
      {query.length < 3 ? (
        <div className="mx-auto max-w-2xl mt-10 glass-panel rounded-3xl p-10 border border-white/10 shadow-glow text-center">
          <FaSearch className="mx-auto text-5xl text-white/25" />
          <p className="mt-5 text-2xl font-bold text-white">
            Find something worth watching
          </p>
          <p className="mt-2 text-sm text-gray-300">
            Type at least 3 characters. Try actor names, titles, or genres.
          </p>
        </div>
      ) : results.length > 0 ? (
        <div className="animate-fade-in-up">
          <h2 className="text-xl md:text-3xl font-bold mb-8 text-white drop-shadow-md">
             {bollywoodOnly ? `Bollywood results for "${query}"` : `Results for "${query}"`}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
            {results.map((movie) => (
              <div key={movie.id} className="w-full">
                 <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl mt-10 glass-panel rounded-3xl p-10 border border-white/10 shadow-glow text-center">
          <p className="text-white text-xl font-semibold">
            No matches for “{query}”
          </p>
          <p className="mt-2 text-sm text-gray-300">Suggestions:</p>
          <ul className="mt-3 text-sm text-gray-300 list-disc list-inside space-y-1">
            <li>Try different keywords</li>
            <li>Search with a shorter title</li>
            <li>Try an actor or director’s name</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Search;
