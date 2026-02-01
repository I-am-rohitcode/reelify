import { useEffect, useState } from "react";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
} from "../api/tmdb";
import { useBollywood } from "../context/BollywoodContext";
import MovieGrid from "../components/MovieGrid"; // Acts as Row now
import Hero from "../components/Hero";
import Loader from "../components/Loader";

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

        const trendingResults = t.data.results;
        setTrending(trendingResults);
        setPopular(p.data.results);
        setTopRated(tr.data.results);
        setUpcoming(u.data.results);
        setNowPlaying(n.data.results);

        // Pick random movie for Hero
        if (trendingResults.length > 0) {
          const random =
            trendingResults[Math.floor(Math.random() * trendingResults.length)];
          setRandomMovie(random);
        }
      } catch (error) {
        console.error("Failed to fetch movies", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [bollywoodOnly]);

  if (loading) return <Loader />;

  return (
    <div className="bg-[#141414] min-h-screen pb-10">
      <Hero movie={randomMovie} />

      <div className="-mt-20 relative z-10 space-y-4">
        <MovieGrid
          title={bollywoodOnly ? "New Bollywood Releases" : "New Releases"}
          movies={nowPlaying}
        />
        <MovieGrid
          title={bollywoodOnly ? "Bollywood Upcoming" : "Upcoming Movies"}
          movies={upcoming}
        />
        <MovieGrid
          title={bollywoodOnly ? "Trending Bollywood" : "Trending Now"}
          movies={trending}
        />
        <MovieGrid
          title={bollywoodOnly ? "Bollywood Top Rated" : "Top Rated"}
          movies={topRated}
        />

        <MovieGrid
          title={bollywoodOnly ? "Popular Bollywood" : "Popular on Reelify"}
          movies={popular}
        />
      </div>
    </div>
  );
}

export default Home;
