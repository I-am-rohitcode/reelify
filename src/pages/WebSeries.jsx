import { useEffect, useState } from "react";
import {
  getTrendingSeries,
  getPopularSeries,
  getTopRatedSeries,
} from "../api/tmdb";
import { useBollywood } from "../context/BollywoodContext";
import MovieGrid from "../components/MovieGrid";
import Loader from "../components/Loader";

function WebSeries() {
  const { bollywoodOnly } = useBollywood();

  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);

        const [t, p, tr] = await Promise.all([
          getTrendingSeries(bollywoodOnly),
          getPopularSeries(bollywoodOnly),
          getTopRatedSeries(bollywoodOnly),
        ]);

        setTrending(t.data.results);
        setPopular(p.data.results);
        setTopRated(tr.data.results);
      } catch (err) {
        console.error("Failed to fetch web series", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [bollywoodOnly]);

  if (loading) return <Loader />;

  return (
    <div className="px-6 py-6 space-y-10">
      <MovieGrid
        title={bollywoodOnly ? "Trending Bollywood Series" : "Trending Series"}
        movies={trending}
      />
      <MovieGrid
        title={bollywoodOnly ? "Popular Bollywood Series" : "Popular Series"}
        movies={popular}
      />
      <MovieGrid
        title={
          bollywoodOnly ? "Top Rated Bollywood Series" : "Top Rated Series"
        }
        movies={topRated}
      />
    </div>
  );
}

export default WebSeries;
