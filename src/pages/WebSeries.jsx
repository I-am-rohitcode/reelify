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
import SEO from "../components/SEO";
import { PRODUCTION_URL } from "../utils/slug";

function WebSeries() {
  const { bollywoodOnly } = useBollywood();

  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [randomSeries, setRandomSeries] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSeries = async () => {
      try {
        setLoading(true);

        const [t, p, tr] = await Promise.all([
          getTrendingSeries(bollywoodOnly),
          getPopularSeries(bollywoodOnly),
          getTopRatedSeries(bollywoodOnly),
        ]);

        if (!isMounted) return;

        const trendingResults = t.data.results || [];
        setTrending(trendingResults);
        setPopular(p.data.results || []);
        setTopRated(tr.data.results || []);

        if (trendingResults.length > 0) {
          const random =
            trendingResults[Math.floor(Math.random() * trendingResults.length)];
          setRandomSeries(random);
        }
      } catch (err) {
        console.error("Failed to fetch web series", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSeries();

    return () => {
      isMounted = false;
    };
  }, [bollywoodOnly]);

  if (loading) return <Loader />;

  const pageTitle = bollywoodOnly
    ? "Discover Hindi Web Series - Trending & Top Rated Bollywood Shows | Reelify"
    : "Discover Web Series - Trending & Top Rated TV Shows | Reelify";

  const pageDesc = bollywoodOnly
    ? "Explore trending Hindi web series and top-rated Indian television shows on Reelify. Discover seasons, episodes, cast, and ratings."
    : "Explore popular web series, trending TV shows, and top-rated television on Reelify. Discover episode guides, seasons, cast, and ratings powered by TMDB.";

  return (
    <main id="content" className="bg-[#050505] min-h-screen pb-10">
      <SEO
        title={pageTitle}
        description={pageDesc}
        canonical={`${PRODUCTION_URL}/series`}
      />

      {/* Semantic H1 for Web Series Page */}
      <h1 className="sr-only">Discover Web Series &amp; TV Shows</h1>

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
    </main>
  );
}

export default WebSeries;
