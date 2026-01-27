import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMulti } from "../api/tmdb";
import { useBollywood } from "../context/BollywoodContext";
import MovieGrid from "../components/MovieGrid";
import Loader from "../components/Loader";

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
      <div className="animate-fade-in">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="px-6 py-10 text-center text-red-400">{error}</div>;
  }

  return (
    <div className="px-6 py-6">
      {query.length < 3 ? (
        <p className="text-gray-400 text-center">
          Type at least 3 characters to search
        </p>
      ) : results.length > 0 ? (
        <MovieGrid
          title={
            bollywoodOnly
              ? `Bollywood results for "${query}"`
              : `Results for "${query}"`
          }
          movies={results}
        />
      ) : (
        <p className="text-gray-400 text-center">
          No results found for "{query}"
        </p>
      )}
    </div>
  );
}

export default Search;
