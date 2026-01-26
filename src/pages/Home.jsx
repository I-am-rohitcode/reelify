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
import Loader from "../components/Loader";

function Home() {
  const { bollywoodOnly } = useBollywood();

  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
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

        setTrending(t.data.results);
        setPopular(p.data.results);
        setTopRated(tr.data.results);
        setUpcoming(u.data.results);
        setNowPlaying(n.data.results);
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
    <div className="px-6 py-6">
      {/* <MovieGrid title="New Releases" movies={nowPlaying} /> */}
      <MovieGrid
        title={bollywoodOnly ? "New Bollywood Releases" : "New Releases"}
        movies={nowPlaying}
      />
      <MovieGrid
        title={bollywoodOnly ? "Bollywood Upcoming Movies" : "Upcoming Movies"}
        movies={upcoming}
      />
      {/* <MovieGrid title="Upcoming Movies" movies={upcoming} /> */}

      <MovieGrid
        title={bollywoodOnly ? "Trending Bollywood Movies" : "Trending Now"}
        movies={trending}
      />
      <MovieGrid
        title={bollywoodOnly ? "Popular Bollywood Movies" : "Popular Movies"}
        movies={popular}
      />
      <MovieGrid
        title={
          bollywoodOnly ? "Top Rated Bollywood Movies" : "Top Rated Movies"
        }
        movies={topRated}
      />
    </div>
  );
}

export default Home;
