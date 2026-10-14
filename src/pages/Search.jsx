import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMulti } from "../api/tmdb";
import { useBollywood } from "../context/BollywoodContext";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";
import SEO from "../components/SEO";
import { FaSearch } from "react-icons/fa";
import { PRODUCTION_URL } from "../utils/slug";

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

    let isMounted = true;

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await searchMulti(query, bollywoodOnly);

        if (!isMounted) return;

        // keep only movies & tv series
        const filtered = res.data.results.filter(
          (item) => item.media_type === "movie" || item.media_type === "tv",
        );

        setResults(filtered);
      } catch (err) {
        console.error("Search failed", err);
        if (isMounted) setError("Something went wrong. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const delay = setTimeout(fetchResults, 400);
    return () => {
      isMounted = false;
      clearTimeout(delay);
    };
  }, [query, bollywoodOnly]);

  const hasQuery = query.trim().length >= 3;
  const seoTitle = hasQuery
    ? `Search results for "${query}" | Reelify`
    : "Search Movies & TV Series | Reelify";
  const seoDesc = hasQuery
    ? `Explore movie and series search results for "${query}" on Reelify. Discover cast, ratings, and trailers.`
    : "Search across thousands of movies and web series on Reelify. Filter by titles, genres, and cast.";

  return (
    <main id="content" className="min-h-screen px-6 md:px-12 lg:px-16 py-32">
      {/* Search Result pages with arbitrary queries are set to noindex, follow to avoid thin low-value indexation */}
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonical={`${PRODUCTION_URL}/search`}
        noindex={hasQuery}
        nofollow={false}
      />

      {/* Primary Semantic H1 */}
      <h1 className="sr-only">Search Movies &amp; TV Series</h1>

      {loading ? (
        <div className="animate-fade-in pt-12">
          <Loader />
        </div>
      ) : error ? (
        <div className="py-12">
          <div className="mx-auto max-w-2xl glass-panel rounded-3xl p-8 border border-white/10 shadow-glow text-center">
            <p className="text-neon-magenta font-semibold text-lg">Search failed</p>
            <p className="mt-2 text-gray-200">{error}</p>
            <p className="mt-4 text-sm text-gray-400">
              Tip: try a shorter title or different spelling.
            </p>
          </div>
        </div>
      ) : query.length < 3 ? (
        <section className="mx-auto max-w-2xl mt-10 glass-panel rounded-3xl p-10 border border-white/10 shadow-glow text-center" aria-label="Search prompt">
          <FaSearch className="mx-auto text-5xl text-white/25" aria-hidden="true" />
          <h2 className="mt-5 text-2xl font-bold text-white">
            Find something worth watching
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Type at least 3 characters. Try actor names, titles, or genres.
          </p>
        </section>
      ) : results.length > 0 ? (
        <section className="animate-fade-in-up" aria-label="Search results">
          <h2 className="text-xl md:text-3xl font-bold mb-8 text-white drop-shadow-md">
            {bollywoodOnly
              ? `Bollywood results for "${query}"`
              : `Results for "${query}"`}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
            {results.map((movie) => (
              <div key={movie.id} className="w-full">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-2xl mt-10 glass-panel rounded-3xl p-10 border border-white/10 shadow-glow text-center" aria-label="No results">
          <h2 className="text-white text-xl font-semibold">
            No matches for “{query}”
          </h2>
          <p className="mt-2 text-sm text-gray-300">Suggestions:</p>
          <ul className="mt-3 text-sm text-gray-300 list-disc list-inside space-y-1 text-left max-w-xs mx-auto">
            <li>Try different keywords</li>
            <li>Search with a shorter title</li>
            <li>Try an actor or director’s name</li>
          </ul>
        </section>
      )}
    </main>
  );
}

export default Search;
