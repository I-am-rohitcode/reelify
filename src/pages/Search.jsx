import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../api/tmdb";
import MovieGrid from "../components/MovieGrid";
import Loader from "../components/Loader";

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 3) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      const res = await searchMovies(query);
      setResults(res.data.results);
      setLoading(false);
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <Loader />
      </div>
    );
  }

  return (
    <div className="px-6 py-6">
      {results.length > 0 ? (
        <MovieGrid title={`Results for "${query}"`} movies={results} />
      ) : (
        <p className="text-gray-400">No movies found</p>
      )}
    </div>
  );
}

export default Search;
