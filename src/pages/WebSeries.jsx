import { useEffect, useState } from "react";
import {
  getTrendingSeries,
  getPopularSeries,
  getTopRatedSeries,
} from "../api/tmdb";
import { useBollywood } from "../context/BollywoodContext";
import MovieGrid from "../components/MovieGrid";
import Hero from "../components/Hero";
import Loader from "../components/Loader";

function WebSeries() {
  const { bollywoodOnly } = useBollywood();

  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [randomSeries, setRandomSeries] = useState(null);
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

        const trendingResults = t.data.results;
        setTrending(trendingResults);
        setPopular(p.data.results);
        setTopRated(tr.data.results);

        if (trendingResults.length > 0) {
          const random =
            trendingResults[Math.floor(Math.random() * trendingResults.length)];
          setRandomSeries(random);
        }
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
    <div className="bg-[#050505] min-h-screen pb-10">
      <Hero movie={randomSeries} />

      <div className="-mt-16 md:-mt-32 lg:-mt-48 relative z-10 space-y-4 md:space-y-8">
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
    </div>
  );
}

export default WebSeries;
