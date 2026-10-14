import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSeriesDetails,
  getSeasonEpisodes,
  getSeriesProviders,
  BACKDROP_URL,
  IMG_URL,
} from "../api/tmdb";
import { FaPlay, FaStar, FaArrowLeft, FaBookmark } from "react-icons/fa";
import Loader from "../components/Loader";
import { extractIdFromSlug } from "../utils/slug";

function SeriesDetails() {
  const { id: slugParam } = useParams();
  const id = extractIdFromSlug(slugParam);
  const navigate = useNavigate();

  const [series, setSeries] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [providers, setProviders] = useState([]);
  const [genre, setGenre] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEpisodes = useCallback(
    async (season) => {
      // console.log("fetchEpisodes called for season:", season);
      try {
        setSelectedSeason(season);
        const ep = await getSeasonEpisodes(id, season);
        console.log(`getSeasonEpisodes for season ${season} success:`, ep.data);
        setEpisodes(ep.data.episodes || []);
      } catch (err) {
        console.error(`Failed to fetch episodes for season ${season}:`, err);
        setEpisodes([]);
      }
    },
    [id],
  );

  useEffect(() => {
    const fetchSeries = async () => {
      console.log("fetchSeries called for TV ID:", id);
      try {
        setLoading(true);
        setError(null);

        const seriesRes = await getSeriesDetails(id);

        console.log("getSeriesDetails success:", seriesRes.data);

        setSeries(seriesRes.data);
        setGenre(seriesRes.data.genres);

        console.log("Genres:", seriesRes.data.genres);

        // Fetch watch providers separately (fail-safe)
        try {
          const providersRes = await getSeriesProviders(id);
          console.log("getSeriesProviders success:", providersRes.data);
          setProviders(
            providersRes.data.results?.IN?.flatrate ||
              providersRes.data.results?.US?.flatrate ||
              [],
          );
        } catch (providerErr) {
          console.warn("Failed to fetch watch providers:", providerErr);
          setProviders([]);
        }

        // Fetch season 1 episodes
        await fetchEpisodes(1);
      } catch (err) {
        console.error("Failed to load series details:", err);
        setError(err.message || "Failed to load series details");
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
    window.scrollTo(0, 0);
  }, [id, fetchEpisodes]);
  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="text-center p-20 text-xl text-red-500 font-sans mt-10">
        <p className="font-bold">Error loading series details:</p>
        <p className="text-gray-400 text-sm mt-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
        >
          Retry
        </button>
      </div>
    );
  }
  if (!series)
    return (
      <div className="text-center p-20 text-xl text-gray-400">
        Series not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600/40">
      {/* Floating Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="hidden md:flex fixed top-24 left-6 lg:left-10 z-50 items-center gap-2 px-5 py-2.5 rounded-full glass-panel hover:bg-white/10 transition-colors shadow-lg shadow-black/50 text-sm font-medium"
      >
        <FaArrowLeft /> Back
      </button>

      {/* Hero Banner Section */}
      <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={
              series.backdrop_path
                ? BACKDROP_URL + series.backdrop_path
                : IMG_URL + series.poster_path
            }
            alt={series.name}
            className="w-full h-full object-cover object-top opacity-50 scale-105"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505] hidden md:block"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-transparent mix-blend-overlay"></div>

        <div className="absolute bottom-0 left-0 w-full px-6 md:px-16 lg:px-24 pb-12 z-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            {series.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium mb-6">
            <span className="flex items-center gap-1.5 text-[#46d369] font-bold">
              {series.vote_average
                ? `${Math.round(series.vote_average * 10)}% Match`
                : "New"}
            </span>
            {series.first_air_date && (
              <span className="text-gray-300">
                {series.first_air_date.split("-")[0]}
              </span>
            )}
            <span className="text-gray-300 border border-gray-600 px-1 rounded-sm text-xs">
              TV-MA
            </span>
            <span className="text-gray-300">
              {series.number_of_seasons} Seasons
            </span>
          </div>

          <p className="text-gray-300 text-base md:text-lg max-w-2xl font-light line-clamp-3 mb-4">
            {series.overview}
          </p>
          <div className="flex flex-wrap gap-2">
            {genre?.map((item) => (
              <span
                key={item.id}
                className="text-gray-300 border border-gray-600 px-2 py-1 rounded-md text-xs font-medium hover:border-white hover:text-white transition-colors"
              >
                {item.name}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <button className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-8 py-3 rounded text-lg font-bold transition-transform transform hover:scale-105">
              <FaPlay className="text-sm" /> Play
            </button>
            <button className="flex items-center gap-2 glass-panel hover:bg-white/10 px-8 py-3 rounded text-lg font-bold transition-all">
              <FaBookmark className="text-sm text-gray-300" /> Watchlist
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-16 lg:px-24 py-12 max-w-[1600px] mx-auto space-y-16">
        {/* OTT Platforms */}
        {providers.length > 0 && (
          <div className="animate-fade-in-up delay-100 mb-10">
            <h3 className="text-xl font-bold mb-4 text-gray-200">
              Available On
            </h3>
            <div className="flex gap-4">
              {providers.map((p) => (
                <img
                  key={p.provider_id}
                  src={IMG_URL + p.logo_path}
                  alt={p.provider_name}
                  className="h-14 rounded-xl shadow-lg border border-gray-800"
                />
              ))}
            </div>
          </div>
        )}

        {/* Episodes Section */}
        <div className="animate-fade-in-up delay-200">
          <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
            <h2 className="text-2xl md:text-3xl font-bold">Episodes</h2>

            <select
              value={selectedSeason}
              onChange={(e) => fetchEpisodes(parseInt(e.target.value))}
              className="bg-gray-900 border border-gray-700 text-white rounded px-4 py-2 text-lg font-bold outline-none hover:bg-gray-800 transition cursor-pointer"
            >
              {series.seasons?.map((s) => (
                <option key={s.id} value={s.season_number}>
                  Season {s.season_number}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {episodes.map((ep) => (
              <div
                key={ep.id}
                className="group flex flex-col sm:flex-row gap-4 sm:gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-xl"
              >
                {/* Episode Thumbnail */}
                <div className="relative w-full sm:w-52 md:w-60 lg:w-64 shrink-0">
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-900">
                    <img
                      src={
                        ep.still_path
                          ? `${IMG_URL}${ep.still_path}`
                          : "https://placehold.co/640x360/111827/9CA3AF?text=No+Image"
                      }
                      alt={ep.name || `Episode ${ep.episode_number}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Episode Number */}
                    <span className="absolute left-2 top-2 rounded-md bg-black/75 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                      EP {String(ep.episode_number).padStart(2, "0")}
                    </span>

                    {/* Runtime */}
                    <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {ep.runtime ? `${ep.runtime} min` : "Runtime N/A"}
                    </span>
                  </div>
                </div>

                {/* Episode Details */}
                <div className="flex min-w-0 flex-1 flex-col py-1">
                  {/* Title and Date */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <h3 className="min-w-0 text-base font-bold leading-snug text-white transition-colors group-hover:text-cyan-300 sm:text-xl">
                      {ep.name || "Untitled Episode"}
                    </h3>

                    <span className="w-fit shrink-0 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-gray-300">
                      {ep.air_date
                        ? ep.air_date.split("-").reverse().join("-")
                        : "Release date N/A"}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-sm leading-6 text-gray-400 line-clamp-3 sm:line-clamp-4">
                    {ep.overview ||
                      "No description available for this episode."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeriesDetails;
