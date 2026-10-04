import { useEffect, useState } from "react";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
} from "../api/tmdb";
import { useBollywood } from "../context/BollywoodContext";
import MovieGrid from "../components/MovieGrid";
import Hero from "../components/Hero";
import Loader from "../components/Loader";
import SEO from "../components/SEO";
import { buildWebSiteSchema } from "../utils/structuredData";
import { PRODUCTION_URL } from "../utils/slug";

function Home() {
  const { bollywoodOnly } = useBollywood();

  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [randomMovie, setRandomMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchMovies = async () => {
      try {
        setLoading(true);

        const [t, p, tr, u, n] = await Promise.all([
          getTrendingMovies(bollywoodOnly),
          getPopularMovies(bollywoodOnly),
          getTopRatedMovies(bollywoodOnly),
          getUpcomingMovies(bollywoodOnly),
          getNowPlayingMovies(bollywoodOnly),
        ]);

        if (!isMounted) return;

        const trendingResults = t.data.results || [];
        setTrending(trendingResults);
        setPopular(p.data.results || []);
        setTopRated(tr.data.results || []);
        setUpcoming(u.data.results || []);
        setNowPlaying(n.data.results || []);

        // Pick random movie for Hero spotlight
        if (trendingResults.length > 0) {
          const random =
            trendingResults[Math.floor(Math.random() * trendingResults.length)];
          setRandomMovie(random);
        }
      } catch (error) {
        console.error("Failed to fetch movies", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMovies();

    return () => {
      isMounted = false;
    };
  }, [bollywoodOnly]);

  if (loading) return <Loader />;

  const pageTitle = bollywoodOnly
    ? "Discover Bollywood Movies - Trending, Top Rated & New Releases | Reelify"
    : "Discover Movies - Trending, Popular, Top Rated & Trailers | Reelify";

  const pageDesc = bollywoodOnly
    ? "Discover trending Bollywood movies, upcoming Hindi cinema, top rated classics, and new releases with ratings, cast, and trailers on Reelify."
    : "Discover trending movies, popular cinema, top rated films, and upcoming releases on Reelify. Explore cast details, ratings, and official trailers powered by TMDB.";

  return (
    <main id="content" className="bg-[#050505] min-h-screen pb-10">
      <SEO
        title={pageTitle}
        description={pageDesc}
        canonical={`${PRODUCTION_URL}/`}
        structuredData={buildWebSiteSchema()}
      />

      {/* Primary Semantic H1 for Homepage */}
      <h1 className="sr-only">Discover Movies</h1>

      <Hero movie={randomMovie} />

      <div className="-mt-16 md:-mt-32 lg:-mt-48 relative z-10 space-y-4 md:space-y-8">
        <MovieGrid
          title={bollywoodOnly ? "New Bollywood Releases" : "New Releases"}
          movies={nowPlaying}
        />
        <MovieGrid
          title={bollywoodOnly ? "Bollywood Upcoming" : "Upcoming Movies"}
          movies={upcoming}
        />
        <MovieGrid
          title={bollywoodOnly ? "Trending Bollywood" : "Trending Movies"}
          movies={trending}
        />
        <MovieGrid
          title={bollywoodOnly ? "Bollywood Top Rated" : "Top Rated Movies"}
          movies={topRated}
        />
        <MovieGrid
          title={bollywoodOnly ? "Popular Bollywood" : "Popular Movies"}
          movies={popular}
        />
      </div>
    </main>
  );
}

export default Home;
