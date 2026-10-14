import { Link } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext";
import MovieCard from "../components/MovieCard";
import SEO from "../components/SEO";
import { PRODUCTION_URL } from "../utils/slug";
import { getMovieUrl, getSeriesUrl } from "../utils/slug";

export default function Watchlist() {
  const { items, clear } = useWatchlist();

  const surprise = () => {
    const pick = items[Math.floor(Math.random() * items.length)];
    window.location.assign(
      pick.media_type === "tv" ? getSeriesUrl(pick) : getMovieUrl(pick),
    );
  };

  return (
    <main
      id="content"
      className="min-h-screen bg-[#050505] px-4 md:px-12 lg:px-16 pt-28 pb-28 md:pb-16"
    >
      <SEO
        title="My Watchlist | Reelify"
        description="Your saved movies and series on Reelify."
        canonical={`${PRODUCTION_URL}/watchlist`}
        noindex
      />
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">My Watchlist</h1>
          <p className="text-gray-400 text-sm mt-1">
            {items.length} saved · stored only on this device
          </p>
        </div>
        {items.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={surprise}
              className="rounded-full bg-white text-black px-4 py-2 text-sm font-semibold focus-ring"
            >
              Pick one for me
            </button>
            <button
              onClick={() =>
                window.confirm("Clear your whole watchlist?") && clear()
              }
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-gray-200 hover:bg-white/10 focus-ring"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="glass-panel rounded-3xl border border-white/10 p-10 text-center max-w-md mx-auto mt-10">
          <p className="text-lg font-semibold">Nothing saved yet</p>
          <p className="text-gray-400 text-sm mt-2">
            Tap the bookmark on any poster to save it for later.
          </p>
          <Link
            to="/mood"
            className="inline-block mt-5 rounded-full bg-white text-black px-5 py-2 text-sm font-semibold focus-ring"
          >
            Find something by mood
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {items.map((m) => (
            <MovieCard key={`${m.media_type}-${m.id}`} movie={m} />
          ))}
        </div>
      )}
    </main>
  );
}
