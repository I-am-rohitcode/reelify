import { useEffect, useState } from "react";
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

function SeriesDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [series, setSeries] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);

        const [s, p] = await Promise.all([
          getSeriesDetails(id),
          getSeriesProviders(id),
        ]);

        setSeries(s.data);

        setProviders(
          p.data.results?.IN?.flatrate || p.data.results?.US?.flatrate || [],
        );

        fetchEpisodes(1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchEpisodes = async (season) => {
    setSelectedSeason(season);
    const ep = await getSeasonEpisodes(id, season);
    setEpisodes(ep.data.episodes || []);
  };

  if (loading) return <Loader />;
  if (!series) return <div className="text-center p-20 text-xl text-gray-400">Series not found.</div>;

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
            src={series.backdrop_path ? BACKDROP_URL + series.backdrop_path : IMG_URL + series.poster_path}
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
              {series.vote_average ? `${Math.round(series.vote_average * 10)}% Match` : "New"}
            </span>
            {series.first_air_date && (
              <span className="text-gray-300">
                {series.first_air_date.split("-")[0]}
              </span>
            )}
            <span className="text-gray-300 border border-gray-600 px-1 rounded-sm text-xs">TV-MA</span>
            <span className="text-gray-300">{series.number_of_seasons} Seasons</span>
          </div>

          <p className="text-gray-300 text-base md:text-lg max-w-2xl font-light line-clamp-3 mb-8">
             {series.overview}
          </p>

          <div className="flex flex-wrap items-center gap-4">
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
            <h3 className="text-xl font-bold mb-4 text-gray-200">Available On</h3>
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
               {series.seasons.map(s => (
                  <option key={s.id} value={s.season_number}>Season {s.season_number}</option>
               ))}
            </select>
          </div>

          <div className="space-y-4">
            {episodes.map((ep) => (
              <div
                key={ep.id}
                className="group flex flex-col md:flex-row gap-6 glass-panel hover:bg-white/5 p-4 rounded-xl transition-colors cursor-pointer"
              >
                <div className="relative flex-none w-full md:w-56 aspect-[16/9] rounded-lg overflow-hidden bg-gray-900">
                  <img
                    src={ep.still_path ? IMG_URL + ep.still_path : "https://via.placeholder.com/300x169?text=No+Image"}
                    alt={ep.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <FaPlay className="text-3xl text-white shadow-lg" />
                  </div>
                </div>

                <div className="flex-1 py-1">
                  <div className="flex items-center justify-between mb-2">
                     <h4 className="font-bold text-lg text-white">
                        {ep.episode_number}. {ep.name}
                     </h4>
                     <span className="text-sm font-bold text-gray-400">{ep.runtime}m</span>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                    {ep.overview || "No description available."}
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
